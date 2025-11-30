// mqtt_config.h - OPTIMIZADO
#pragma once

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Variables/funciones definidas en main.cpp
extern bool manualOverrideLED;

// Handlers de comandos MQTT
void handleLEDCommand(const char *cmd);    // "on" / "off"
void handleManualControl(bool isManual);   // true / false
void handleWindowCommand(const char *cmd); // "open" / "closed"
void handleDoorCommand(const char *cmd);   // "open" / "closed"

// Inicialización y loop de MQTT
void initMQTTConnection();
void loopMQTTConnection();