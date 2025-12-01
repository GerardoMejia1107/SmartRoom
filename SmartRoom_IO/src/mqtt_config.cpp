#include <Arduino.h>
#include <ArduinoJson.h>
#include "../lib/mqtt_config.h"

// ====== CONFIG MQTT ======
const char *MQTT_HOST = "192.168.1.35";
const int MQTT_PORT = 1883;
const char *MQTT_USER = "mariaDB";
const char *MQTT_PASS = "root";

// ====== TOPICS ======
const char *TOPIC_ALLOWED_UPDATE = "rfid/allowed/update";
const char *TOPIC_MANUAL_UPDATE = "device/manual_control/available";
const char *TOPIC_DOOR_UPDATE = "device/door/state";

// ====== CLIENTES ======
WiFiClient espClient;
PubSubClient mqttClient(espClient);

// ====== RFID UIDs PERMITIDOS ======
String allowedUIDs[50];
int allowedCount = 0;

// ====== CONTROL MANUAL PUERTA ======
bool manualControlDoor = false;
bool doorRequestedOpen = false;

// ====== RECONEXIÓN NO BLOQUEANTE ======
unsigned long lastMQTTReconnectAttempt = 0;
const unsigned long MQTT_RECONNECT_INTERVAL = 5000; // 5 s

// ============================================================================
//                               CALLBACK MQTT
// ============================================================================
static void mqttCallback(char *topic, byte *payload, unsigned int length)
{
  // Copiar payload a String seguro
  char buf[256];
  unsigned int n = (length < sizeof(buf) - 1) ? length : (sizeof(buf) - 1);
  memcpy(buf, payload, n);
  buf[n] = '\0';

  String body = String(buf);
  body.trim();

  Serial.print(F("[MQTT] Topic <"));
  Serial.print(topic);
  Serial.print(F("> => '"));
  Serial.print(body);
  Serial.println(F("'"));

  // ========= 1) ACTUALIZAR UID PERMITIDOS =========
  if (strcmp(topic, TOPIC_ALLOWED_UPDATE) == 0)
  {
    StaticJsonDocument<1024> doc;
    DeserializationError error = deserializeJson(doc, body);

    if (error)
    {
      Serial.print(F("[MQTT] Error JSON UIDs: "));
      Serial.println(error.c_str());
      return;
    }

    allowedCount = 0;
    JsonArray arr = doc.as<JsonArray>();

    for (JsonVariant v : arr)
    {
      if (allowedCount < 50)
      {
        allowedUIDs[allowedCount++] = v.as<String>();
      }
    }

    Serial.print(F("[MQTT] UIDs actualizados: "));
    Serial.println(allowedCount);
    return;
  }

  // ========= 2) HABILITAR / DESHABILITAR CONTROL MANUAL =========
  if (strcmp(topic, TOPIC_MANUAL_UPDATE) == 0)
  {
    // esperamos "true" / "false"
    manualControlDoor = (body == "true" || body == "1" || body == "on");

    Serial.print(F("[DOOR] Modo manual: "));
    Serial.println(manualControlDoor ? F("ENABLED") : F("DISABLED"));
    return;
  }

  // ========= 3) COMANDO MANUAL DE PUERTA =========
  if (strcmp(topic, TOPIC_DOOR_UPDATE) == 0)
  {
    // Solo tiene efecto si el modo manual está activado
    if (!manualControlDoor)
    {
      Serial.println(F("[DOOR] Ignorado: manual_control = false"));
      return;
    }

    if (body == "open")
    {
      doorRequestedOpen = true;
      Serial.println(F("[DOOR] Comando manual: OPEN"));
    }
    else if (body == "closed")
    {
      doorRequestedOpen = false;
      Serial.println(F("[DOOR] Comando manual: CLOSED"));
    }
    else
    {
      Serial.println(F("[DOOR] Comando inválido (usa 'open'/'closed')"));
    }

    return;
  }

  // ========= TOPIC DESCONOCIDO =========
  Serial.println(F("[MQTT] ⚠ Topic no reconocido"));
}

// ============================================================================
//                        RECONEXIÓN MQTT NO BLOQUEANTE
// ============================================================================
bool reconnectMQTT()
{
  if (mqttClient.connected())
  {
    return true;
  }

  unsigned long now = millis();
  if (now - lastMQTTReconnectAttempt < MQTT_RECONNECT_INTERVAL)
  {
    return false;
  }

  lastMQTTReconnectAttempt = now;
  Serial.print(F("[MQTT] Conectando... "));

  String clientId = F("ESP8266_RFID_DOOR_");
  clientId += String(ESP.getChipId(), HEX);

  if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASS))
  {
    Serial.println(F("OK"));

    // Suscripciones necesarias
    mqttClient.subscribe(TOPIC_ALLOWED_UPDATE, 1);
    mqttClient.subscribe(TOPIC_MANUAL_UPDATE, 1);
    mqttClient.subscribe(TOPIC_DOOR_UPDATE, 1);

    Serial.println(F("[MQTT] Suscrito a:"));
    Serial.print(F("  ✓ "));
    Serial.println(TOPIC_ALLOWED_UPDATE);
    Serial.print(F("  ✓ "));
    Serial.println(TOPIC_MANUAL_UPDATE);
    Serial.print(F("  ✓ "));
    Serial.println(TOPIC_DOOR_UPDATE);

    return true;
  }
  else
  {
    Serial.print(F("FALLÓ, rc="));
    Serial.println(mqttClient.state());
    return false;
  }
}

// ============================================================================
//                               API PÚBLICA
// ============================================================================
void initMQTTConnection()
{
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);

  mqttClient.setKeepAlive(15);
  mqttClient.setSocketTimeout(5);
  mqttClient.setBufferSize(512);

  reconnectMQTT();
}

void loopMQTTConnection()
{
  if (!mqttClient.connected())
  {
    reconnectMQTT();
  }
  else
  {
    mqttClient.loop();
  }
}
