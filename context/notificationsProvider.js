"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { UserContext } from "./userContextProvider";
import mqtt from "mqtt";
const MQTT_ADDRESS = "ws://localhost:8000/mqtt";

export const NotificationsContext = createContext();

export const NotificationsContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [followedMovies, setFollowedMovies] = useState([]);

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_ADDRESS);

    const fetchFollowedList = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:7000/api/followed/${userId}`
        );
        if (response.ok) {
          const data = await response.json();

          setFollowedMovies(data.movies);

          console.log("jest user");

          data.movies.forEach((movie) => {
            const topic = `comment/movie/${movie.id}`;
            console.log("subskrybuję temat", topic);
            mqttClient.subscribe(topic);
          });

          mqttClient.on("message", (topic, message) => {
            console.log("powiadomienie", message.toString());
            setNotifications((prevNotifications) => [
              {
                comment: message.toString(),
                movieId: topic.split("/").pop(),
                time: new Date().toLocaleTimeString(),
              },
              ...prevNotifications,
            ]);
          });
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (user) {
      fetchFollowedList(user.id);

      return () => {
        mqttClient.end();
      };
    }
  }, [user]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, followedMovies, setFollowedMovies }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
