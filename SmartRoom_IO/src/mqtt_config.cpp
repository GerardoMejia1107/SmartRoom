#include <Arduino.h>
#include <ArduinoJson.h>
#include "../lib/mqtt_config.h"

const char *MQTT_HOST = "192.168.1.44";
const int MQTT_PORT = 1883;
const char *MQTT_USER = "mariaDB";
const char *MQTT_PASS = "root";

const char *TOPIC_ALLOWED_UPDATE = "rfid/allowed/update";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

String allowedUIDs[50];
int allowedCount = 0;

void mqttCallback(char *topic, byte *payload, unsigned int lenght)
{
  if (String(topic) == TOPIC_ALLOWED_UPDATE)
  {
    String body;

    for (unsigned int i = 0; i < lenght; i++)
    {
      body += (char)payload[i];
    }

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, body);

    if (!error)
    {
      allowedCount = 0;

      for (JsonVariant v : doc.as<JsonArray>())
      {
        allowedUIDs[allowedCount++] = v.as<String>();
      }

      Serial.println("[MQTT] Updated allowed UIDs:");
      for (int i = 0; i < allowedCount; i++)
      {
        Serial.println("  - " + allowedUIDs[i]);
      }
    }
  }
}

// Inicializar la conexión
void initMQTTConnection()
{
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);

  keepAliveMQTTConnection();
};

// Mantener viva la conexion
void keepAliveMQTTConnection()
{
  while (!mqttClient.connected())
  {
    Serial.print("[MQTT] Connecting ...");

    if (mqttClient.connect("ESP8266_client", MQTT_USER, MQTT_PASS))
    {
      Serial.print("OK MQTT established");

      // Si la conexión se da, entonces paso a suscribirme a un topic
      mqttClient.subscribe(TOPIC_ALLOWED_UPDATE);
      Serial.print("[MQTT] Subscribed to allowed UID topic");
    }
    else
    {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.print("retraying in 2 seconds");
      delay(2000);
    }
  }
}

// LOOP
void loopMQTTConnection()
{
  if (!mqttClient.connected())
  {
    keepAliveMQTTConnection();
  }
  mqttClient.loop();
};