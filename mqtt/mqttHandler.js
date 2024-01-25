import mqtt from "mqtt";

const MQTT_ADDRESS = "ws://localhost:8000/mqtt";

let mqttClient;

export const connectToMQTT = () => {
  mqttClient = mqtt.connect(MQTT_ADDRESS);

  mqttClient.on("connect", () => {
    console.log("tworze i łączę się z klientem");
  });

  return mqttClient;
};

export const disconnectFromMQTT = () => {
  if (mqttClient) {
    mqttClient.end();
    console.log("łokieć pięta nie ma klienta");
  }
};

export const getMQTTClient = () => {
  return mqttClient;
};
