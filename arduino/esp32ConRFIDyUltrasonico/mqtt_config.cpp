#include "mqtt_config.h"
#include <ArduinoJson.h>

const char * MQTT_HOST = "192.168.1.44";
const char * MQTT_PORT = 1883;
const char * MQTT_USER = "mariaDB";
const char * MQTT_PASS = "root";

const char * TOPIC_ALLOWED_UPDATE = "rfid/allowed/update";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

String allowedUIDs[50];
int allowedCount = 0;


void MQTT_connection(){
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.seetCallback(mqttCallback);

  reconnectMQTT();  
}

void reconnectMQTT(){
  while(!mqttClient.connected()){
    Serial.print("[MQTT] Connecting... ");

    if(mqttClient.connect("ESP8266_Client"), MQTT)
  }
}


void mqttLoop();


