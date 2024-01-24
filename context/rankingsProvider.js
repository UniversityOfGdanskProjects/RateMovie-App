"use client";
import { createContext, useState, useEffect } from "react";
import mqtt from "mqtt";
export const RankingContext = createContext();

const MQTT_ADDRESS = "ws://localhost:8000/mqtt";
const rankingUpdateTopic = "ranking/update";

export const RankingContextProvider = ({ children }) => {
  const [rankedMovies, setRankedMovies] = useState([]);
  const [rankedUsers, setRankedUsers] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch("http://localhost:7000/api/ranking/movies");
      const data = await response.json();
      if (response.ok) setRankedMovies(data);
    };

    const fetchUsers = async () => {
      const response = await fetch("http://localhost:7000/api/ranking/users");
      const data = await response.json();
      if (response.ok) setRankedUsers(data);
    };

    fetchMovies();
    fetchUsers();

    const handleRankingUpdate = (message) => {
      console.log("Received ranking update:", message);
      fetchMovies();
      fetchUsers();
    };

    const mqttClient = mqtt.connect(MQTT_ADDRESS);

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker in context");
      mqttClient.subscribe(rankingUpdateTopic);
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === rankingUpdateTopic) {
        handleRankingUpdate(message.toString());
      }
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);
  return (
    <RankingContext.Provider value={{ rankedMovies, rankedUsers }}>
      {children}
    </RankingContext.Provider>
  );
};
