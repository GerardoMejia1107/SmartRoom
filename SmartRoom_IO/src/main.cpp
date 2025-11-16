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
const uint8_t SERVO_DOOR_PIN = D4; // ¡D0 NO! Usa D4 (GPIO2)
Servo door;
const int DOOR_CLOSED = 0;
const int DOOR_OPEN = 180;
const unsigned long DOOR_OPEN_MS = 3000UL;

// --------- ULTRASONIDO ----------
const uint8_t US_TRIG = D0;                      // GPIO16 (solo salida)
const uint8_t US_ECHO = D8;                      // GPIO15 (entrada)
const unsigned long SAMPLE_MS = 300;             // periodo de muestreo
const int COUNT_START_CM = 20;                   // empieza a contar si ≤ 20 cm
const unsigned long PRESENCE_LIMIT_MS = 30000UL; // 30 s
unsigned long presenceMs = 0;

// --------- LED ALARMA ----------
const uint8_t LED_ALARM = D3;                   // GPIO0 (con su resistencia)
const unsigned long AUTH_OK_GRACE_MS = 10000UL; // 10 s de gracia tras RFID
unsigned long lastAuthOkMs = 0;

// --------- UIDs PERMITIDOS (HEX sin ':') ----------
/* const char *ALLOWED[] = {"A3299BF4"};
const size_t ALLOWED_N = sizeof(ALLOWED) / sizeof(ALLOWED[0]); */

bool isAllowed(const String &uid)
{
  for (int i = 0; i < allowedCount; i++)
    if (uid == allowedUIDs[i])
      return true;
  return false;
}

void openDoorOnce()
{
  door.write(DOOR_OPEN);
  delay(DOOR_OPEN_MS);
  door.write(DOOR_CLOSED);
}

long ping_cm()
{
  // Disparo
  digitalWrite(US_TRIG, LOW);
  delayMicroseconds(3);
  digitalWrite(US_TRIG, HIGH);
  delayMicroseconds(12);
  digitalWrite(US_TRIG, LOW);
  // Eco (35 ms ~ 6 m)
  long dur = pulseIn(US_ECHO, HIGH, 35000UL);
  if (dur == 0)
    return -1;
  long cm = dur / 58;
  if (cm < 2 || cm > 400)
    return -1;
  return cm;
}

void alarmBlink5s()
{
  unsigned long t0 = millis();
  while (millis() - t0 < 5000UL)
  {
    digitalWrite(LED_ALARM, HIGH);
    delay(120);
    digitalWrite(LED_ALARM, LOW);
    delay(120);
  }
}

// Definición de algunas funciones
void POST_data(String URL, String payload);

void setup()
{
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  Serial.print("Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n WiFi conectado.");

  initMQTTConnection();

  pinMode(LED_ALARM, OUTPUT);
  digitalWrite(LED_ALARM, LOW);

  // RC522
  SPI.begin(); // SCK=D5, MISO=D6, MOSI=D7
  rfid.PCD_Init();
  delay(50);
  Serial.print(F("Version RC522: "));
  Serial.println(rfid.PCD_ReadRegister(MFRC522::VersionReg), HEX);
  Serial.println(F("ESP8266-A listo."));

  // Servo (autotest)
  door.attach(SERVO_DOOR_PIN);
  door.write(DOOR_CLOSED);
  delay(400);
  door.write(DOOR_OPEN);
  delay(600);
  door.write(DOOR_CLOSED);

  // Ultrasonido
  pinMode(US_TRIG, OUTPUT);
  pinMode(US_ECHO, INPUT);
}

void loop()
{
  loopMQTTConnection();
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
      Serial.println(F("ACCESO PERMITIDO -> abriendo puerta"));
      lastAuthOkMs = millis();
      presenceMs = 0;
      openDoorOnce();

      // Enviar data de accceso permitido al backend
      POST_data("http://192.168.1.44:3000/api/logs", "{\"uid\":\"" + uid + "\",\"authorized\":true,\"source\":\"esp32-A\"}");
    }
    else
    {
      // Enviar data de acceso denegado al backend
      Serial.println(F("ACCESO DENEGADO"));
      POST_data("http://192.168.1.44:3000/api/logs", "{\"uid\":\"" + uid + "\",\"authorized\":false,\"source\":\"esp32-A\"}");
    }

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }

  // -------- ULTRASONIDO (conteo a ≤20 cm) --------
  static unsigned long lastUS = 0;
  if (millis() - lastUS >= SAMPLE_MS)
  {
    lastUS = millis();
    long cm = ping_cm();
    Serial.print(F("[US] Distancia: "));
    Serial.println(cm);

    if (cm > 0 && cm <= COUNT_START_CM)
    {
      presenceMs += SAMPLE_MS; // objeto MUY CERCA -> contar
    }
    else
    {
      presenceMs = 0; // lejos o sin eco -> reset
    }

    bool authRecent = (millis() - lastAuthOkMs) < AUTH_OK_GRACE_MS;
    if (presenceMs >= PRESENCE_LIMIT_MS && !authRecent)
    {
      POST_data("http://192.168.1.44:3000/api/alerts", "{\"type\":\"unauthorized_presence\","
                                                       "\"description\":\"Presencia >30s sin RFID valido\","
                                                       "\"duration_ms\":30000,"
                                                       "\"source\":\"esp32-A\"}");

      Serial.println(F("[ALERTA] Presencia >30s sin RFID valido"));
      alarmBlink5s();
      presenceMs = 0;
    }
  }
}

// Metodos para comunicarse con el backend
void POST_data(String URL, String payload)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    http.begin(httpWiFiClient, URL);

    http.setTimeout(5000);
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(payload);

    Serial.print("Backend respuesta: ");
    Serial.println(httpCode);
    http.end();
  }
}
