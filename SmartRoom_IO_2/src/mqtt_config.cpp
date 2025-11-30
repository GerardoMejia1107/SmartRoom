// mqtt_config.cpp - OPTIMIZADO
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "../lib/mqtt_config.h"

// ====== CONFIG MQTT ======
const char *MQTT_HOST = "192.168.1.35";
const int MQTT_PORT = 1883;
const char *MQTT_USER = "mariaDB";
const char *MQTT_PASS = "root";

// TOPICS
const char *TOPIC_LED_UPDATE = "device/lights/state";
const char *TOPIC_MANUAL_UPDATE = "device/manual_control/available";
const char *TOPIC_WINDOW_UPDATE = "device/window/state";
// const char *TOPIC_DOOR_UPDATE = "device/door/state";

// TOPICS DE CONFIRMACIÓN (para debug)
const char *TOPIC_STATUS = "device/status";

// Cliente MQTT
static WiFiClient espClient;
static PubSubClient mqttClient(espClient);

// Reconexión más agresiva
static unsigned long lastReconnectAttempt = 0;
static const unsigned long RECONNECT_INTERVAL_MS = 2000; // 2s (era 5s)

// Estadísticas
static unsigned long messagesReceived = 0;
static unsigned long lastStatsReport = 0;
static const unsigned long STATS_INTERVAL_MS = 60000; // Cada minuto

// ============ CALLBACK MQTT OPTIMIZADO ============
void mqttCallback(char *topic, byte *payload, unsigned int length)
{
  messagesReceived++;

  // Buffer más grande y seguro
  char buf[128];
  unsigned int n = (length < sizeof(buf) - 1) ? length : (sizeof(buf) - 1);
  memcpy(buf, payload, n);
  buf[n] = '\0';

  String body = String(buf);
  body.trim(); // Eliminar espacios

  Serial.print("[MQTT] Topic <");
  Serial.print(topic);
  Serial.print("> => '");
  Serial.print(body);
  Serial.println("'");

  // Procesamiento rápido sin Serial.print excesivos
  bool handled = false;

  // Luces
  if (strcmp(topic, TOPIC_LED_UPDATE) == 0)
  {
    if (body == "on" || body == "off")
    {
      handleLEDCommand(body.c_str());
      handled = true;
    }
  }
  // Modo manual disponible
  else if (strcmp(topic, TOPIC_MANUAL_UPDATE) == 0)
  {
    bool isManual = (body == "true" || body == "1" || body == "on");
    handleManualControl(isManual);
    handled = true;
  }
  // Ventana
  else if (strcmp(topic, TOPIC_WINDOW_UPDATE) == 0)
  {
    if (body == "open" || body == "closed")
    {
      handleWindowCommand(body.c_str());
      handled = true;
    }
  }
  // Puerta
  /*   else if (strcmp(topic, TOPIC_DOOR_UPDATE) == 0)
    {
      if (body == "open" || body == "closed")
      {
        handleDoorCommand(body.c_str());
        handled = true;
      }
    } */

  if (handled)
  {
    // Confirmar recepción (opcional, comentar si satura)
    // mqttClient.publish(TOPIC_STATUS, "command_received", false);
  }
  else
  {
    Serial.println("[MQTT] ⚠ Comando no reconocido");
  }
}

// ============ RECONEXIÓN OPTIMIZADA ============
static void ensureMQTTConnected()
{
  if (mqttClient.connected())
  {
    return;
  }

  unsigned long now = millis();
  if (now - lastReconnectAttempt < RECONNECT_INTERVAL_MS)
  {
    return; // Aún no toca intentar
  }
  lastReconnectAttempt = now;

  Serial.print("[MQTT] Reconnecting... ");

  // ID único por dispositivo
  String clientId = "ESP8266_B_";
  clientId += String(ESP.getChipId(), HEX);

  if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASS))
  {
    Serial.println("✓ OK");

    // Suscripciones con QoS 1 (at least once)
    mqttClient.subscribe(TOPIC_LED_UPDATE, 1);
    mqttClient.subscribe(TOPIC_MANUAL_UPDATE, 1);
    mqttClient.subscribe(TOPIC_WINDOW_UPDATE, 1);
    // mqttClient.subscribe(TOPIC_DOOR_UPDATE, 1);

    Serial.println("[MQTT] Subscribed with QoS 1:");
    Serial.print("  ✓ ");
    Serial.println(TOPIC_LED_UPDATE);
    Serial.print("  ✓ ");
    Serial.println(TOPIC_MANUAL_UPDATE);
    Serial.print("  ✓ ");
    Serial.println(TOPIC_WINDOW_UPDATE);
    Serial.print("  ✓ ");
    // Serial.println(TOPIC_DOOR_UPDATE);

    // Publicar estado inicial
    mqttClient.publish(TOPIC_STATUS, "online", true); // retain = true
  }
  else
  {
    Serial.print("✗ FAILED, rc=");
    Serial.print(mqttClient.state());
    Serial.println(" (retrying in 2s)");
  }
}

// ============ ESTADÍSTICAS ============
void reportStats()
{
  unsigned long now = millis();
  if (now - lastStatsReport >= STATS_INTERVAL_MS)
  {
    lastStatsReport = now;

    Serial.println("\n═══════ MQTT STATS ═══════");
    Serial.print("  Messages received: ");
    Serial.println(messagesReceived);
    Serial.print("  Connection: ");
    Serial.println(mqttClient.connected() ? "✓ OK" : "✗ DISCONNECTED");
    Serial.println("═══════════════════════════\n");
  }
}

// ============ API PÚBLICA ============

void initMQTTConnection()
{
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);

  // Optimizaciones críticas
  mqttClient.setKeepAlive(15);    // 15s (era 20s)
  mqttClient.setSocketTimeout(5); // 5s timeout
  mqttClient.setBufferSize(512);  // Buffer más grande (default 256)

  Serial.println("[MQTT] Configuration:");
  Serial.print("  Server: ");
  Serial.print(MQTT_HOST);
  Serial.print(":");
  Serial.println(MQTT_PORT);
  Serial.print("  KeepAlive: 15s");
  Serial.print(" | Timeout: 5s");
  Serial.println(" | Buffer: 512 bytes");

  lastReconnectAttempt = 0;
  messagesReceived = 0;
  lastStatsReport = millis();

  ensureMQTTConnected();
}

void loopMQTTConnection()
{
  ensureMQTTConnected();

  if (mqttClient.connected())
  {
    // CRÍTICO: loop() debe ejecutarse MUY frecuentemente
    mqttClient.loop();
  }

  // Reportar stats periódicamente
  reportStats();
}