#include <Servo.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* WIFI_SSID = "CLARO1_1B20F6";
const char* WIFI_PASS = "492BCORuFG";
const char* URI_BACKEND = "http://192.168.1.44:3000/api/sensors";

HTTPClient http;
WiFiClient client;

const unsigned POST_INTERVAL_RATE = 5000;
static unsigned PREVIOUS_MILLIS = 0;

// ========= Pines =========
#define DHTPIN D4  // DATA del DHT11
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const uint8_t SERVO_WIN_PIN = D5;  // señal del servo de la ventana
Servo win;

const uint8_t LDR_PIN = A0;  // 0..1023
const uint8_t LED_LUZ = D6;  // LED para luz (poca luz => ON)
const uint8_t PIR_PIN = D1;  // salida del PIR

// ========= Reglas de temperatura (tus valores) =========
const float T_CLOSE = 26.9;  // ≤28 -> cerrar
const float T_OPEN = 27.0;   // ≥29 -> abrir

// Posiciones del servo (ajusta a tu montaje)
const int WIN_CLOSED = 0;
const int WIN_OPEN = 180;

// ========= ADC / LDR en Volts =========
// VREF externo visto en A0. En la mayoría de NodeMCU/Wemos ~3.3 V.
// Ajusta si tu placa reporta distinto (p. ej. 3.20).
const float ADC_VREF = 3.30;

// Umbrales con histéresis EN VOLTS para evitar parpadeos
// Se ENCIENDE si V < LDR_ON_V  (poca luz)
// Se APAGA   si V > LDR_OFF_V (mucha luz)
float LDR_ON_V = 1.80;   // ajústalo según lecturas reales
float LDR_OFF_V = 2.20;  // debe ser > LDR_ON_V

// ========= Timers =========
const unsigned long DHT_MS = 2000;
const unsigned long PIR_MS = 500;
const unsigned long LDR_PRINT_MS = 2000;

unsigned long lastDht = 0, lastPir = 0, lastLdrPrint = 0;

enum WState { W_C,
              W_O };
WState wstate = W_C;

// Estado del LED de luz (para imprimir solo cuando cambie)
bool ledLuzEncendido = false;

void setWindow(WState s) {
  if (s == W_O) {
    win.write(WIN_OPEN);
    wstate = W_O;
    Serial.println(F("[VENTANA] ABIERTA"));
  } else {
    win.write(WIN_CLOSED);
    wstate = W_C;
    Serial.println(F("[VENTANA] CERRADA"));
  }
}

void setup() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  Serial.print("Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED) {
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
  digitalWrite(LED_LUZ, LOW);  // apagado inicial
  ledLuzEncendido = false;

  // PIR
  pinMode(PIR_PIN, INPUT);  // si tu PIR flota, usa INPUT_PULLUP y ajusta la lógica
}

void loop() {
  unsigned long now = millis();

  // ---- DHT cada 2 s: controla ventana por temperatura ----
  if (now - lastDht >= DHT_MS) {
    lastDht = now;

    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (!isnan(t) && !isnan(h)) {
      Serial.print(F("[DHT] Temp: "));
      Serial.print(t);
      Serial.print(F(" °C  | Hum: "));
      Serial.print(h);
      Serial.println(F(" %"));

      // Zona muerta 28–29 para evitar vibración
      if (t <= T_CLOSE && wstate != W_C) setWindow(W_C);
      else if (t >= T_OPEN && wstate != W_O) setWindow(W_O);
    } else {
      Serial.println(F("[DHT] Error de lectura"));
    }
  }

  // ---- LDR continuo: LED por poca luz + mensajes y voltaje ----
  int ldrRaw = analogRead(LDR_PIN);            // 0..1023
  float ldrV = (ldrRaw * ADC_VREF) / 1023.0f;  // conversión a volts

  // Histéresis en VOLTS: cambio solo al cruzar umbrales opuestos
  if (!ledLuzEncendido && ldrV < LDR_ON_V) {
    ledLuzEncendido = true;
    digitalWrite(LED_LUZ, LOW);  // LED ON (externo típico activo en HIGH)
    //Serial.print(F("[LDR] Poca luz -> LED ENCENDIDO | raw="));
    Serial.print(F("[LDR] Mucha luz -> LED APAGADO | raw="));
    Serial.print(ldrRaw);
    Serial.print(F(" | V="));
    Serial.print(ldrV, 2);
    Serial.println(F(" V"));
  } else if (ledLuzEncendido && ldrV > LDR_OFF_V) {
    ledLuzEncendido = false;
    digitalWrite(LED_LUZ, HIGH);  // LED OFF
    //Serial.print(F("[LDR] Mucha luz -> LED APAGADO | raw="));
    Serial.print(F("[LDR] Poca luz -> LED ENCENDIDO | raw="));
    Serial.print(ldrRaw);
    Serial.print(F(" | V="));
    Serial.print(ldrV, 2);
    Serial.println(F(" V"));
  }

  // Imprime cada 2 s para calibrar (raw + volts + estado LED)
  if (now - lastLdrPrint >= LDR_PRINT_MS) {
    lastLdrPrint = now;
    Serial.print(F("[LDR] raw="));
    Serial.print(ldrRaw);
    Serial.print(F(" | V="));
    Serial.print(ldrV, 2);
    Serial.print(F(" V | LED="));
    //Serial.println(ledLuzEncendido ? F("ENCENDIDO") : F("APAGADO"));
    Serial.println(ledLuzEncendido ? F("APAGADO") : F("ENCENDIDO"));
  }

  // ---- PIR cada 0.5 s: solo mensajes ----
  if (now - lastPir >= PIR_MS) {
    lastPir = now;
    int pir = digitalRead(PIR_PIN);
    Serial.println(pir ? F("[PIR] Movimiento") : F("[PIR] Sin movimiento"));
  }

  unsigned long CURRENT_MILLIS = millis();
  if (CURRENT_MILLIS - PREVIOUS_MILLIS > POST_INTERVAL_RATE) {
    PREVIOUS_MILLIS = CURRENT_MILLIS;
    //valores actuales
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int ldrRaw = analogRead(LDR_PIN);
    bool motion = digitalRead(PIR_PIN);

    String payload = "{";
    payload += "\"temperature_c\":" + String(t, 1) + ",";
    payload += "\"humidity_pct\":" + String(h, 1) + ",";
    payload += "\"light_adc\":" + String(ldrRaw) + ",";
    payload += "\"low_light\":" + String(ledLuzEncendido ? "true" : "false") + ",";
    payload += "\"motion\":" + String(motion ? "true" : "false") + ",";
    payload += "\"source\":\"esp32-B\"";
    payload += "}";

    POST_data(URI_BACKEND, payload);
  }
}

void POST_data(String URL, String payload) {
  if (WiFi.status() == WL_CONNECTED) {
    http.begin(client, URL);

    http.setTimeout(5000);
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(payload);

    Serial.print("Backend respuesta: ");
    Serial.println(httpCode);
    http.end();
  }
}
