import mqtt from "mqtt";
import { config } from "dotenv";
config();

const { MQTT_ADDRESS } = process.env;

export const sendRankingUpdate = () => {
  try {
    const rankingUpdateTopic = "ranking/update";
    const mqttClient = mqtt.connect(MQTT_ADDRESS);

    mqttClient.publish(
      rankingUpdateTopic,
      "Ranking has been updated",
      (err) => {
        if (err) {
          console.error("Error publishing ranking update:", err);
          mqttClient.end();
        }
        mqttClient.end();
      }
    );
  } catch (error) {
    console.error("Error sending ranking update:", error);
  }
};

export const sendNotification = (movieId, comment) => {
  try {
    const topic = `comment/movie/${movieId}`;
    const mqttClient = mqtt.connect(MQTT_ADDRESS);
    console.log("przed wysłaniem");

    mqttClient.publish(topic, comment, (err) => {
      console.log("wysyłam na", topic, "komentarz", comment);
      if (err) {
        console.error("Error sending notifiaction:", err);
        mqttClient.end();
      }
      mqttClient.end();
    });
  } catch (error) {
    console.error("Error sending notifiaction", error);
  }
};
