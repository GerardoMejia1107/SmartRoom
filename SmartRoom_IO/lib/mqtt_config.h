#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// ====== CONFIG MQTT ======
extern const char *MQTT_HOST;
extern const int MQTT_PORT;
extern const char *MQTT_USER;
extern const char *MQTT_PASS;

// ====== RFID UIDs PERMITIDOS ======
extern String allowedUIDs[50];
extern int allowedCount;

// ====== TOPICS ======
extern const char *TOPIC_ALLOWED_UPDATE; // "rfid/allowed/update"
extern const char *TOPIC_MANUAL_UPDATE;  // "device/manual_control/available"
extern const char *TOPIC_DOOR_UPDATE;    // "rfid/door/update"

// ====== CLIENTES MQTT ======
extern WiFiClient espClient;
extern PubSubClient mqttClient;

// ====== RECONEXIÓN NO BLOQUEANTE ======
extern unsigned long lastMQTTReconnectAttempt;
extern const unsigned long MQTT_RECONNECT_INTERVAL;

// ====== ESTADO DE PUERTA / CONTROL MANUAL ======
extern bool manualControlDoor; // true => puerta se controla por MQTT
extern bool doorRequestedOpen; // estado que llega por "rfid/door/update"

// API
void initMQTTConnection();
bool reconnectMQTT();
void loopMQTTConnection();

#endif
