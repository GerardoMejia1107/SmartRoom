// main.cpp - OPTIMIZADO + LDR FIX
#include <Arduino.h>
#include <Servo.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "../lib/mqtt_config.h"

// ========= FLAGS GLOBALES CONTROLADAS POR MQTT =========
bool manualOverrideLED = false; // true => NO lógica automática de LDR para LED

// ========= WIFI / BACKEND =========
const char *WIFI_SSID = "CLARO1_1B20F6";
const char *WIFI_PASS = "492BCORuFG";

const char *URI_BACKEND = "http://192.168.1.35:3000/api/sensors";

HTTPClient http;
WiFiClient client;

// POST cada 30 segundos
const unsigned long POST_INTERVAL_RATE = 30000;
static unsigned long PREVIOUS_MILLIS = 0;

// ========= PINES =========
#define DHTPIN D4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const uint8_t SERVO_WIN_PIN = D5;
Servo win;

const uint8_t LDR_PIN = A0;
const uint8_t LED_LUZ = D6;
const uint8_t PIR_PIN = D1;

// ========= TEMPERATURA / VENTANA =========
const float T_CLOSE = 20.5;
const float T_OPEN = 25.0;

const int WIN_CLOSED = 0;
const int WIN_OPEN = 180;

// ========= LDR / UMBRALES =========
double LDR_ON_PERCENTAGE = 30.0;
double LDR_OFF_PERCENTAGE = 55.0;

// ========= TIMERS OPTIMIZADOS =========
const unsigned long DHT_MS = 120000;      // 2 minutos
const unsigned long PIR_MS = 5000;        // 5 segundos
const unsigned long LDR_CHECK_MS = 5000;  // 5 segundos - LECTURA CONSTANTE
const unsigned long LDR_PRINT_MS = 30000; // 30 segundos - solo para debug

unsigned long lastDht = 0;
unsigned long lastPir = 0;
unsigned long lastLdrCheck = 0;
unsigned long lastLdrPrint = 0;

// ========= CACHE DE SENSORES =========
struct SensorCache
{
  float temperature = 0.0;
  float humidity = 0.0;
  int ldrRaw = 0;
  float ldrPct = 0.0;
  bool pirState = false;
  unsigned long lastUpdate = 0;
} sensorCache;

// ========= PIR - SIN DELAYS =========
bool pirState = false;
bool lastPirState = false;
unsigned long pirLastDetection = 0;
unsigned long pirDebounceStart = 0;
bool pirDebouncing = false;
const unsigned long PIR_DEBOUNCE_MS = 2000;
const unsigned long PIR_COOLDOWN_MS = 5000;

// ========= ESTADO VENTANA =========
enum WState
{
  W_C,
  W_O
};
WState wstate = W_C;

// ========= ESTADO LED =========
bool ledLuzEncendido = false;

// ========== FUNCIONES CONTROL DESDE MQTT ==========

// LED "on" / "off" manual
void handleLEDCommand(const char *cmd)
{
  manualOverrideLED = true;

  if (strcmp(cmd, "on") == 0)
  {
    digitalWrite(LED_LUZ, HIGH);
    ledLuzEncendido = true;
    Serial.println("[CONTROL MANUAL] LED → ON");
  }
  else if (strcmp(cmd, "off") == 0)
  {
    digitalWrite(LED_LUZ, LOW);
    ledLuzEncendido = false;
    Serial.println("[CONTROL MANUAL] LED → OFF");
  }
}

// Cambiar entre manual / auto
void handleManualControl(bool isManual)
{
  manualOverrideLED = isManual;

  Serial.print("[CONTROL] Modo ");
  Serial.println(isManual ? "MANUAL" : "AUTO");

  if (!isManual)
  {
    // Re-sincronizar LED con cache al regresar a AUTO
    if (sensorCache.ldrPct < LDR_ON_PERCENTAGE && !ledLuzEncendido)
    {
      digitalWrite(LED_LUZ, HIGH);
      ledLuzEncendido = true;
      Serial.println("[AUTO] LED → ON (re-sync por poca luz)");
    }
    else if (sensorCache.ldrPct > LDR_OFF_PERCENTAGE && ledLuzEncendido)
    {
      digitalWrite(LED_LUZ, LOW);
      ledLuzEncendido = false;
      Serial.println("[AUTO] LED → OFF (re-sync por suficiente luz)");
    }
  }
}

// Desde MQTT: "open" / "closed" para la ventana
void handleWindowCommand(const char *cmd)
{
  if (strcmp(cmd, "open") == 0)
  {
    win.write(WIN_OPEN);
    wstate = W_O;
    Serial.println("[MQTT] Ventana → ABIERTA (manual)");
  }
  else if (strcmp(cmd, "closed") == 0)
  {
    win.write(WIN_CLOSED);
    wstate = W_C;
    Serial.println("[MQTT] Ventana → CERRADA (manual)");
  }
}

// Desde MQTT: puerta
void handleDoorCommand(const char *cmd)
{
  Serial.print("[MQTT] Door command => ");
  Serial.println(cmd);
}

// ========= CONTROL VENTANA AUTOMÁTICO =========
void setWindow(WState s)
{
  if (s == W_O)
  {
    win.write(WIN_OPEN);
    wstate = W_O;
    Serial.println(F("[VENTANA] ABIERTA (auto)"));
  }
  else
  {
    win.write(WIN_CLOSED);
    wstate = W_C;
    Serial.println(F("[VENTANA] CERRADA (auto)"));
  }
}

// ========= HTTP POST OPTIMIZADO =========
bool isPosting = false;

void POST_data(const String &URL, const String &payload)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("[HTTP] WiFi no conectado, salto POST");
    return;
  }

  if (isPosting)
  {
    Serial.println("[HTTP] POST anterior aún en curso, skip");
    return;
  }

  isPosting = true;

  http.begin(client, URL);
  http.setTimeout(500); // 500ms máx
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(payload);

  Serial.print("[HTTP] Backend respuesta: ");
  Serial.println(httpCode > 0 ? String(httpCode) : "TIMEOUT");

  http.end();
  isPosting = false;
}

// ========= LECTURA DE SENSORES CACHEADA =========
void updateSensorCache()
{
  unsigned long now = millis();

  // DHT cada 2 minutos
  if (now - lastDht >= DHT_MS)
  {
    lastDht = now;

    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (!isnan(t) && !isnan(h))
    {
      sensorCache.temperature = t;
      sensorCache.humidity = h;
      sensorCache.lastUpdate = now;

      Serial.print(F("[DHT] Temp: "));
      Serial.print(t);
      Serial.print(F(" °C  | Hum: "));
      Serial.print(h);
      Serial.println(F(" %"));

      // Lógica de ventana con histéresis
      if (t <= T_CLOSE && wstate != W_C)
      {
        setWindow(W_C);
      }
      else if (t >= T_OPEN && wstate != W_O)
      {
        setWindow(W_O);
      }
    }
    else
    {
      Serial.println(F("[DHT] Error de lectura"));
    }
  }

  // LDR cada 5 segundos - SIEMPRE actualizar el cache
  if (now - lastLdrCheck >= LDR_CHECK_MS)
  {
    lastLdrCheck = now;

    // ACTUALIZAR SIEMPRE EL CACHE
    sensorCache.ldrRaw = analogRead(LDR_PIN);
    sensorCache.ldrPct = 100.0f - ((sensorCache.ldrRaw / 1023.0f) * 100.0f);
    sensorCache.lastUpdate = now; // Actualizar timestamp

    // Control automático del LED SOLO si está en modo AUTO
    if (!manualOverrideLED)
    {
      if (!ledLuzEncendido && sensorCache.ldrPct < LDR_ON_PERCENTAGE)
      {
        ledLuzEncendido = true;
        digitalWrite(LED_LUZ, HIGH);

        Serial.println("══════════  LDR EVENT (AUTO) ══════════");
        Serial.printf("  RAW: %d\n", sensorCache.ldrRaw);
        Serial.printf("  LIGHT: %.1f %%\n", sensorCache.ldrPct);
        Serial.println("  → LOW LIGHT DETECTED → LED ON");
        Serial.println("════════════════════════════════════════");
      }
      else if (ledLuzEncendido && sensorCache.ldrPct > LDR_OFF_PERCENTAGE)
      {
        ledLuzEncendido = false;
        digitalWrite(LED_LUZ, LOW);

        Serial.println("══════════  LDR EVENT (AUTO) ══════════");
        Serial.printf("  RAW: %d\n", sensorCache.ldrRaw);
        Serial.printf("  LIGHT: %.1f %%\n", sensorCache.ldrPct);
        Serial.println("  → HIGH LIGHT DETECTED → LED OFF");
        Serial.println("════════════════════════════════════════");
      }
    }
  }

  // STATUS LDR cada 30 segundos
  if (now - lastLdrPrint >= LDR_PRINT_MS)
  {
    lastLdrPrint = now;

    Serial.println("══════════  LDR STATUS  ══════════");
    Serial.printf("  RAW: %d\n", sensorCache.ldrRaw);
    Serial.printf("  LIGHT: %.1f %%\n", sensorCache.ldrPct);
    Serial.printf("  LED: %s\n", ledLuzEncendido ? "ON" : "OFF");
    Serial.printf("  MODE: %s\n", manualOverrideLED ? "MANUAL" : "AUTO");
    Serial.println("════════════════════════════════════════");
  }

  // PIR cada 1 minuto - SIN DELAYS
  if (now - lastPir >= PIR_MS)
  {
    lastPir = now;

    int pirReading = digitalRead(PIR_PIN);

    if (now - pirLastDetection >= PIR_COOLDOWN_MS)
    {
      if (pirReading == HIGH && !pirState && !pirDebouncing)
      {
        pirDebouncing = true;
        pirDebounceStart = now;
      }

      // Verificar después de 150ms sin bloquear
      if (pirDebouncing && (now - pirDebounceStart >= 150))
      {
        if (digitalRead(PIR_PIN) == HIGH)
        {
          pirState = true;
          pirLastDetection = now;
          sensorCache.pirState = true;
          Serial.println(F("[PIR] ☆ MOVIMIENTO DETECTADO ☆"));
        }
        pirDebouncing = false;
      }
    }

    if (pirReading == LOW && pirState && (now - pirLastDetection >= PIR_DEBOUNCE_MS))
    {
      pirState = false;
      sensorCache.pirState = false;
      Serial.println(F("[PIR] Sin movimiento"));
    }

    if (pirState != lastPirState)
    {
      lastPirState = pirState;
    }
  }
}

// ========= SETUP =========
void setup()
{
  Serial.begin(115200);
  delay(100);
  Serial.println();
  Serial.println(F("ESP8266-B: DHT11 + Ventana + LDR/LED + PIR + MQTT [LDR FIX]"));

  // WIFI
  Serial.print("Conectando WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  WiFi.setSleepMode(WIFI_NONE_SLEEP);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[WIFI] Conectado.");
  Serial.print("[WIFI] IP: ");
  Serial.println(WiFi.localIP());

  // Sensores
  dht.begin();

  // Servo ventana
  win.attach(SERVO_WIN_PIN);
  setWindow(W_C);

  // LDR + LED
  pinMode(LED_LUZ, OUTPUT);
  digitalWrite(LED_LUZ, LOW);
  ledLuzEncendido = false;

  // PIR
  pinMode(PIR_PIN, INPUT);

  // Inicializar cache con primera lectura
  sensorCache.ldrRaw = analogRead(LDR_PIN);
  sensorCache.ldrPct = 100.0f - ((sensorCache.ldrRaw / 1023.0f) * 100.0f);

  //  INICIAL DHT11 (CRÍTICO)
  Serial.println(F("\n[DHT] Esperando inicialización (2s)..."));
  delay(2000); // DHT11 necesita 2s después de encender

  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (!isnan(t) && !isnan(h))
  {
    sensorCache.temperature = t;
    sensorCache.humidity = h;
    sensorCache.lastUpdate = millis();

    Serial.println(F("══════════  DHT INICIAL  ══════════"));
    Serial.print(F("  Temperatura: "));
    Serial.print(t);
    Serial.println(F(" °C"));
    Serial.print(F("  Humedad: "));
    Serial.print(h);
    Serial.println(F(" %"));
    Serial.println(F("════════════════════════════════════════"));
  }
  else
  {
    Serial.println(F("[DHT] ⚠ Error en lectura inicial - reintentando en próximo ciclo"));
  }

  // MQTT
  initMQTTConnection();

  Serial.println(F("\n[SYSTEM] Inicialización completa"));
  Serial.println(F("═════════════════════════════════════"));
}

// ========= LOOP OPTIMIZADO =========
void loop()
{
  // MQTT SIEMPRE PRIMERO - Sin bloqueos
  loopMQTTConnection();

  unsigned long now = millis();

  // Actualizar cache de sensores (sin bloqueos)
  updateSensorCache();

  // MQTT otra vez para procesar más rápido
  loopMQTTConnection();

  // POST al backend cada 30s
  if (now - PREVIOUS_MILLIS >= POST_INTERVAL_RATE)
  {
    PREVIOUS_MILLIS = now;

    // Usar datos cacheados
    String payload = "{";
    payload += "\"temperature_c\":" + String(sensorCache.temperature, 1) + ",";
    payload += "\"humidity_pct\":" + String(sensorCache.humidity, 1) + ",";
    payload += "\"light_pct\":" + String((int)sensorCache.ldrPct) + ",";
    payload += "\"low_light\":" + String(ledLuzEncendido ? "true" : "false") + ",";
    payload += "\"motion\":" + String(sensorCache.pirState ? "true" : "false") + ",";
    payload += "\"manual_mode\":" + String(manualOverrideLED ? "true" : "false") + ",";
    payload += "\"source\":\"esp8266-B\"";
    payload += "}";

    POST_data(URI_BACKEND, payload);
  }

  // MQTT una vez más al final
  loopMQTTConnection();

  // Yield para evitar watchdog reset
  yield();
}