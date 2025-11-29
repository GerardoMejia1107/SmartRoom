#include <Arduino.h>
#include <Servo.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char *WIFI_SSID = "CLARO1_1B20F6";
const char *WIFI_PASS = "492BCORuFG";

const char *URI_BACKEND = "http://192.168.1.44:3000/api/sensors";

HTTPClient http;
WiFiClient client;

const unsigned POST_INTERVAL_RATE = 10000;
static unsigned PREVIOUS_MILLIS = 0;

// ========= Pines =========
#define DHTPIN D4 // DATA del DHT11
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const uint8_t SERVO_WIN_PIN = D5; // señal del servo de la ventana
Servo win;

const uint8_t LDR_PIN = A0; // 0..1023
const uint8_t LED_LUZ = D6; // LED para luz (poca luz => ON)
const uint8_t PIR_PIN = D1; // salida del PIR

// ========= Reglas de temperatura (tus valores) =========
const float T_CLOSE = 26.9; // ≤28 -> cerrar
const float T_OPEN = 27.0;  // ≥29 -> abrir

// Posiciones del servo (ajusta a tu montaje)
const int WIN_CLOSED = 0;
const int WIN_OPEN = 180;

// ========= ADC / LDR en Volts =========
const float ADC_VREF = 3.30;

// Umbrales con histéresis EN VOLTS para evitar parpadeos
float LDR_ON_V = 1.80;
float LDR_OFF_V = 2.20;

double LDR_ON_PERCENTAGE = 25.0;
double LDR_OFF_PERCENTAGE = 70.0;

// ========= Timers =========
const unsigned long DHT_MS = 2000;
const unsigned long PIR_MS = 500;
const unsigned long LDR_PRINT_MS = 2000;

unsigned long lastDht = 0, lastPir = 0, lastLdrPrint = 0;

// ========= Variables PIR mejoradas =========
bool pirState = false;
bool lastPirState = false;
unsigned long pirLastDetection = 0;
const unsigned long PIR_DEBOUNCE_MS = 2000; // Tiempo de debounce para PIR
const unsigned long PIR_COOLDOWN_MS = 5000; // Tiempo mínimo entre detecciones

enum WState
{
  W_C,
  W_O
};
WState wstate = W_C;

// Estado del LED de luz (para imprimir solo cuando cambie)
bool ledLuzEncendido = false;

void setWindow(WState s)
{
  if (s == W_O)
  {
    win.write(WIN_OPEN);
    wstate = W_O;
    Serial.println(F("[VENTANA] ABIERTA"));
  }
  else
  {
    win.write(WIN_CLOSED);
    wstate = W_C;
    Serial.println(F("[VENTANA] CERRADA"));
  }
}

void POST_data(String URL, String payload);

void setup()
{
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  Serial.print("Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n WiFi conectado.");

  Serial.begin(115200);
  Serial.println();
  Serial.println(F("ESP8266-B: DHT11 + Ventana + LDR/LED (voltios) + PIR"));

  // DHT
  dht.begin();

  // Servo ventana (arranca cerrado)
  win.attach(SERVO_WIN_PIN);
  setWindow(W_C);

  // LDR + LED
  pinMode(LED_LUZ, OUTPUT);
  digitalWrite(LED_LUZ, LOW); // apagado inicial
  ledLuzEncendido = false;

  // PIR - Configuración mejorada
  pinMode(PIR_PIN, INPUT);

  // Espera inicial para que el PIR se estabilice (30-60 segundos recomendados)
  Serial.println(F("[PIR] Inicializando sensor (espera 30 segundos...)"));
  for (int i = 0; i < 30; i++)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println(F("\n[PIR] Sensor listo"));
}

void loop()
{
  unsigned long now = millis();

  // ---- DHT cada 2 s: controla ventana por temperatura ----
  if (now - lastDht >= DHT_MS)
  {
    lastDht = now;

    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (!isnan(t) && !isnan(h))
    {
      Serial.print(F("[DHT] Temp: "));
      Serial.print(t);
      Serial.print(F(" °C  | Hum: "));
      Serial.print(h);
      Serial.println(F(" %"));

      // Zona muerta 28–29 para evitar vibración
      if (t <= T_CLOSE && wstate != W_C)
        setWindow(W_C);
      else if (t >= T_OPEN && wstate != W_O)
        setWindow(W_O);
    }
    else
    {
      Serial.println(F("[DHT] Error de lectura"));
    }
  }

  // ---- LDR continuo: LED por poca luz + mensajes y voltaje ----
  int ldrRaw = analogRead(LDR_PIN);
  float ldrPct = 100.0f - ((ldrRaw / 1023.0f) * 100.0f);

  // ----- LIGHT LOGIC WITH HYSTERESIS -----
  if (!ledLuzEncendido && ldrPct < 30.0f)
  {
    ledLuzEncendido = true;
    digitalWrite(LED_LUZ, HIGH);

    Serial.println("──────────  LDR EVENT  ──────────");
    Serial.printf("  RAW: %d\n", ldrRaw);
    Serial.printf("  LIGHT: %.1f %%\n", ldrPct);
    Serial.println("  → LOW LIGHT DETECTED → LED ON");
    Serial.println("──────────────────────────────────");
  }
  else if (ledLuzEncendido && ldrPct > 70.0f)
  {
    ledLuzEncendido = false;
    digitalWrite(LED_LUZ, LOW);

    Serial.println("──────────  LDR EVENT  ──────────");
    Serial.printf("  RAW: %d\n", ldrRaw);
    Serial.printf("  LIGHT: %.1f %%\n", ldrPct);
    Serial.println("  → HIGH LIGHT DETECTED → LED OFF");
    Serial.println("──────────────────────────────────");
  }

  // ----- PERIODIC STATUS PRINT EVERY 2s -----
  if (now - lastLdrPrint >= LDR_PRINT_MS)
  {
    lastLdrPrint = now;

    Serial.println("──────────  LDR STATUS  ──────────");
    Serial.printf("  RAW: %d\n", ldrRaw);
    Serial.printf("  LIGHT: %.1f %%\n", ldrPct);
    Serial.printf("  LED: %s\n", ledLuzEncendido ? "ON" : "OFF");
    Serial.println("──────────────────────────────────");
  }

  // ---- PIR MEJORADO: con debounce y cooldown ----
  if (now - lastPir >= PIR_MS)
  {
    lastPir = now;

    int pirReading = digitalRead(PIR_PIN);

    // Solo procesar si ha pasado el tiempo de cooldown
    if (now - pirLastDetection >= PIR_COOLDOWN_MS)
    {
      // Detección con debounce
      if (pirReading == HIGH && !pirState)
      {
        unsigned long detectionTime = now;

        // Verificar que la detección sea consistente por un tiempo
        bool consistentDetection = true;
        for (int i = 0; i < 3; i++)
        {
          delay(50);
          if (digitalRead(PIR_PIN) == LOW)
          {
            consistentDetection = false;
            break;
          }
        }

        if (consistentDetection)
        {
          pirState = true;
          pirLastDetection = detectionTime;
          Serial.println(F("[PIR] ★ MOVIMIENTO DETECTADO ★"));
        }
      }
    }

    // Resetear estado cuando no hay lectura
    if (pirReading == LOW && pirState && (now - pirLastDetection >= PIR_DEBOUNCE_MS))
    {
      pirState = false;
      Serial.println(F("[PIR] Sin movimiento"));
    }

    // Solo imprimir cuando cambia el estado
    if (pirState != lastPirState)
    {
      lastPirState = pirState;
    }
  }

  // ---- ENVÍO DE DATOS AL BACKEND ----
  unsigned long CURRENT_MILLIS = millis();
  if (CURRENT_MILLIS - PREVIOUS_MILLIS > POST_INTERVAL_RATE)
  {
    PREVIOUS_MILLIS = CURRENT_MILLIS;

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int ldr_pct = 100.0f - ((ldrRaw / 1023.0f) * 100.0f);;

    String payload = "{";
    payload += "\"temperature_c\":" + String(t, 1) + ",";
    payload += "\"humidity_pct\":" + String(h, 1) + ",";
    payload += "\"light_pct\":" + String(ldr_pct) + ",";
    payload += "\"low_light\":" + String(ledLuzEncendido ? "true" : "false") + ",";
    payload += "\"motion\":" + String(pirState ? "true" : "false") + ",";
    payload += "\"source\":\"esp32-B\"";
    payload += "}";

    POST_data(URI_BACKEND, payload);
  }
}

void POST_data(String URL, String payload)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    http.begin(client, URL);

    http.setTimeout(5000);
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(payload);

    Serial.print("Backend respuesta: ");
    Serial.println(httpCode);
    http.end();
  }
}