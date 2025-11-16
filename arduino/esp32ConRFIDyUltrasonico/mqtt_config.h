#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

extern const char * MQTT_HOST;
extern const char * MQTT_PORT;
extern const char * MQTT_USER;
extern const char * MQTT_PASS;

//Topics
//Allowed UID (Unique Identifier from RFID)
extern const char * TOPIC_ALLOWED_UPDATE;

//Clients
extern WiFiClient espClient;
extern PubSubClient mqttClient;

WiFiClient espclient;
PubSubClient client(espclient);

void MQTT_connection();
void reconnectMQTT();
void mqttLoop();

#endif