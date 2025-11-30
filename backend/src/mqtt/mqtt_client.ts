import mqtt, { MqttClient } from "mqtt";
import { UserService } from "../services/user_service";

const MQTT_HOST = "mqtt://192.168.1.35";
const MQTT_USER = "mariaDB";
const MQTT_PASSWORD = "root";

const client: MqttClient = mqtt.connect(MQTT_HOST, {
  username: MQTT_USER,
  password: MQTT_PASSWORD,
});

client.on("connect", async () => {
  try {
    console.log("[MQTT] Connected to the broker");

    const allowed = await UserService.getAllActiveUIDs();

    client.publish("rfid/allowed/update", JSON.stringify(allowed), {
      retain: true,
    });
  } catch (e: any) {
    console.log(e.message);
  }
});

client.on("error", (err) => {
  console.error("[MQTT] Error", err.message);
});

export default client;
