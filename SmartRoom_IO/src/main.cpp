#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "../lib/mqtt_config.h"

const char *WIFI_SSID = "CLARO1_1B20F6";
const char *WIFI_PASS = "492BCORuFG";
const char *BACKEND_URL = "http://192.168.1.35:3000/api/logs";

HTTPClient http;
WiFiClient httpWiFiClient;

// --------- RC522 ----------
const uint8_t SS_PIN = D2;  // SDA/SS
const uint8_t RST_PIN = D1; // RST
MFRC522 rfid(SS_PIN, RST_PIN);

// --------- SERVO PUERTA ----------
const uint8_t SERVO_DOOR_PIN = D4;
Servo door;
const int DOOR_CLOSED = 0;
const int DOOR_OPEN = 180;
const unsigned long DOOR_OPEN_MS = 3000UL;

// Control no bloqueante de la puerta
bool doorIsOpening = false;
unsigned long doorOpenStartTime = 0;

// Control MQTT (viene de mqtt_config.cpp)
extern bool manualControlDoor; // true => puerta controlada por MQTT
extern bool doorRequestedOpen; // valor pedido por "rfid/door/update"

// --------- ULTRASONIDO ----------
const uint8_t US_TRIG = D0;
const uint8_t US_ECHO = D8;
const unsigned long SAMPLE_MS = 300;
const int COUNT_START_CM = 20;
const unsigned long PRESENCE_LIMIT_MS = 30000UL;
unsigned long presenceMs = 0;

// --------- LED ALARMA ----------
const uint8_t LED_ALARM = D3;
const unsigned long AUTH_OK_GRACE_MS = 10000UL;
unsigned long lastAuthOkMs = 0;

// Control no bloqueante de alarma
bool alarmIsBlinking = false;
unsigned long alarmStartTime = 0;
unsigned long lastAlarmToggle = 0;
const unsigned long ALARM_BLINK_MS = 120;
const unsigned long ALARM_DURATION_MS = 5000;
bool alarmLedState = false;

// Control de HTTP no bloqueante
struct HTTPRequest
{
  String url;
  String payload;
  bool pending;
};
HTTPRequest pendingRequest = {"", "", false};

// --------- FUNCIONES ----------

bool isAllowed(const String &uid)
{
  for (int i = 0; i < allowedCount; i++)
    if (uid == allowedUIDs[i])
      return true;
  return false;
}

// Versión no bloqueante de apertura de puerta
void startOpenDoor()
{
  if (!doorIsOpening)
  {
    door.write(DOOR_OPEN);
    doorIsOpening = true;
    doorOpenStartTime = millis();
  }
}

void updateDoor()
{
  if (doorIsOpening && (millis() - doorOpenStartTime >= DOOR_OPEN_MS))
  {
    door.write(DOOR_CLOSED);
    doorIsOpening = false;
  }
}

long ping_cm()
{
  digitalWrite(US_TRIG, LOW);
  delayMicroseconds(3);
  digitalWrite(US_TRIG, HIGH);
  delayMicroseconds(12);
  digitalWrite(US_TRIG, LOW);

  long dur = pulseIn(US_ECHO, HIGH, 35000UL);
  if (dur == 0)
    return -1;

  long cm = dur / 58;
  if (cm < 2 || cm > 400)
    return -1;

  return cm;
}

// Versión no bloqueante de alarma
void startAlarm()
{
  if (!alarmIsBlinking)
  {
    alarmIsBlinking = true;
    alarmStartTime = millis();
    lastAlarmToggle = millis();
    alarmLedState = true;
    digitalWrite(LED_ALARM, HIGH);
  }
}

void updateAlarm()
{
  if (!alarmIsBlinking)
    return;

  unsigned long now = millis();

  // Verificar si terminó la duración de la alarma
  if (now - alarmStartTime >= ALARM_DURATION_MS)
  {
    alarmIsBlinking = false;
    digitalWrite(LED_ALARM, LOW);
    return;
  }

  // Alternar LED
  if (now - lastAlarmToggle >= ALARM_BLINK_MS)
  {
    lastAlarmToggle = now;
    alarmLedState = !alarmLedState;
    digitalWrite(LED_ALARM, alarmLedState ? HIGH : LOW);
  }
}

// HTTP no bloqueante - encolar solicitud
void queueHTTPRequest(const String &url, const String &payload)
{
  if (!pendingRequest.pending)
  {
    pendingRequest.url = url;
    pendingRequest.payload = payload;
    pendingRequest.pending = true;
  }
  else
  {
    Serial.println(F("[HTTP] Solicitud anterior pendiente, omitiendo..."));
  }
}

// Procesar solicitud HTTP pendiente
void processHTTPRequest()
{
  if (!pendingRequest.pending || WiFi.status() != WL_CONNECTED)
  {
    return;
  }

  http.begin(httpWiFiClient, pendingRequest.url);
  http.setTimeout(3000); // Timeout reducido a 3 segundos
  http.addHeader(F("Content-Type"), F("application/json"));

  int httpCode = http.POST(pendingRequest.payload);

  if (httpCode > 0)
  {
    Serial.print(F("[HTTP] Resp: "));
    Serial.println(httpCode);
  }
  else
  {
    Serial.print(F("[HTTP] Error: "));
    Serial.println(http.errorToString(httpCode));
  }

  http.end();
  pendingRequest.pending = false;
}

void setup()
{
  Serial.begin(115200);

  // Configurar pines antes de WiFi
  pinMode(LED_ALARM, OUTPUT);
  digitalWrite(LED_ALARM, LOW);
  pinMode(US_TRIG, OUTPUT);
  pinMode(US_ECHO, INPUT);

  // WiFi con timeout
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  Serial.print(F("Conectando WiFi"));
  unsigned long wifiStart = millis();
  while (WiFi.status() != WL_CONNECTED && (millis() - wifiStart < 15000))
  {
    delay(250); // Delay reducido
    Serial.print(F("."));
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println(F("\nWiFi conectado"));
    Serial.println(WiFi.localIP());
  }
  else
  {
    Serial.println(F("\nWiFi falló, continuando..."));
  }

  // MQTT no bloqueante
  initMQTTConnection();

  // RC522
  SPI.begin();
  rfid.PCD_Init();
  delay(50); // Único delay necesario para inicialización de hardware

  Serial.print(F("RC522 v"));
  Serial.println(rfid.PCD_ReadRegister(MFRC522::VersionReg), HEX);

  // Servo - test rápido
  door.attach(SERVO_DOOR_PIN);
  door.write(DOOR_CLOSED);
  delay(300);
  door.write(DOOR_OPEN);
  delay(400);
  door.write(DOOR_CLOSED);

  Serial.println(F("Sistema listo"));
}

void loop()
{
  // MQTT no bloqueante
  loopMQTTConnection();

  // Actualizar estados no bloqueantes
  updateDoor();
  updateAlarm();
  processHTTPRequest();

  // -------- CONTROL MANUAL DE PUERTA (MQTT) --------
  if (manualControlDoor)
  {
    // MQTT pide abrir
    if (doorRequestedOpen && !doorIsOpening && door.read() != DOOR_OPEN)
    {
      Serial.println(F("[DOOR] MQTT → OPEN"));
      door.write(DOOR_OPEN);
      startOpenDoor(); // para autocierre si quieres
    }

    // MQTT pide cerrar
    if (!doorRequestedOpen && door.read() != DOOR_CLOSED)
    {
      Serial.println(F("[DOOR] MQTT → CLOSE"));
      door.write(DOOR_CLOSED);
    }
  }

  // -------- RFID --------
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial())
  {
    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++)
    {
      if (rfid.uid.uidByte[i] < 0x10)
        uid += "0";
      uid += String(rfid.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();

    Serial.print(F("UID="));
    Serial.println(uid);

    if (isAllowed(uid))
    {
      Serial.println(F("ACCESO PERMITIDO"));
      lastAuthOkMs = millis();
      presenceMs = 0;
      if (!manualControlDoor)
      {
        startOpenDoor();
        Serial.println(F("Puerta Abierta"));
      }
      else
      {
        Serial.println(F("Puerta bajo control manual MQTT, no se abre"));
      }

      queueHTTPRequest(
          "http://192.168.1.35:3000/api/logs",
          "{\"uid\":\"" + uid + "\",\"authorized\":true,\"source\":\"esp32-A\"}");
    }
    else
    {
      Serial.println(F("ACCESO DENEGADO"));
      queueHTTPRequest(
          "http://192.168.1.35:3000/api/logs",
          "{\"uid\":\"" + uid + "\",\"authorized\":false,\"source\":\"esp32-A\"}");
    }

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }

  // -------- ULTRASONIDO --------
  // -------- ULTRASONIDO --------
  static unsigned long lastUS = 0;
  if (millis() - lastUS >= SAMPLE_MS)
  {
    lastUS = millis();
    long cm = ping_cm();

    // DEBUG: Imprimir valores del sensor
    static unsigned long lastDebug = 0;
    if (millis() - lastDebug >= 2000)
    {
      Serial.print("[US] Distancia: ");
      Serial.print(cm);
      Serial.print(" cm | PresenceMs: ");
      Serial.print(presenceMs);
      Serial.print(" | AuthRecent: ");
      Serial.println((millis() - lastAuthOkMs) < AUTH_OK_GRACE_MS ? "SI" : "NO");
      lastDebug = millis();
    }

    if (cm > 0 && cm <= COUNT_START_CM)
    {
      presenceMs += SAMPLE_MS;
      Serial.print("[US] Detección: ");
      Serial.print(cm);
      Serial.println(" cm - Acumulando...");
    }
    else
    {
      if (presenceMs > 0)
      {
        Serial.println("[US] Sin detección - Reset contador");
      }
      presenceMs = 0;
    }

    bool authRecent = (millis() - lastAuthOkMs) < AUTH_OK_GRACE_MS;

    if (presenceMs >= PRESENCE_LIMIT_MS && !authRecent && !alarmIsBlinking)
    {
      Serial.println(F("[ALERTA] Presencia >30s sin RFID"));

      queueHTTPRequest(
          "http://192.168.1.35:3000/api/alerts",
          "{\"type\":\"unauthorized_presence\","
          "\"description\":\"Presencia >30s sin RFID valido\","
          "\"duration_ms\":30000,"
          "\"source\":\"esp32-A\"}");

      startAlarm();
      presenceMs = 0;
    }
  }
}