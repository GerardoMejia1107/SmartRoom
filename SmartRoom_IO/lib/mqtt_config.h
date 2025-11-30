#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

extern const char *MQTT_HOST;
extern const int MQTT_PORT;
extern const char *MQTT_USER;
extern const char *MQTT_PASS;

extern String allowedUIDs[50];
extern int allowedCount;

// Topics
// Allowed UID (Unique Identifier from RFID)
extern const char *TOPIC_ALLOWED_UPDATE;

// Clients
extern WiFiClient espClient;
extern PubSubClient mqttClient;

void initMQTTConnection();
void keepAliveMQTTConnection();
void loopMQTTConnection();

#endif