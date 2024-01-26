"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";
import {
  connectToMQTT,
  disconnectFromMQTT,
  getMQTTClient,
} from "@/mqtt/mqttHandler";

export default function AdminChatPage() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [joined, setJoined] = useState(false);

  const mqttClient = getMQTTClient() || connectToMQTT();

  useEffect(() => {
    if (user) {
      const topic = `chat/admin`;

      mqttClient.subscribe(topic);

      mqttClient.on("message", (topic, message) => {
        const receivedMessage = JSON.parse(message.toString());
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });

      return () => {
        mqttClient.unsubscribe(topic);
        mqttClient.removeAllListeners("message");
      };
    }
  }, [user, mqttClient]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (user && messageInput.trim() !== "") {
      const topic = `chat/admin`;
      const sentMessage = {
        sender: user.username,
        text: messageInput,
      };

      mqttClient.publish(
        topic,
        JSON.stringify(sentMessage),
        { qos: 1 },
        (err) => {
          if (err) {
            console.error("Error publishing message:", err);
          }
        }
      );

      setMessageInput("");
    }
  };

  const handleJoin = () => {
    setJoined(true);
    const topic = `chat/admin`;

    mqttClient.subscribe(topic);
    const sentMessage = {
      sender: user.username,
      text: "has joined the chat",
    };
    mqttClient.publish(
      topic,
      JSON.stringify(sentMessage),
      { qos: 1 },
      (err) => {
        if (err) {
          console.error("Error publishing message:", err);
        }
      }
    );
  };

  const handleLeave = () => {
    setJoined(false);
    const topic = `chat/admin`;
    const sentMessage = {
      sender: user.username,
      text: "has left the chat",
    };
    mqttClient.publish(
      topic,
      JSON.stringify(sentMessage),
      { qos: 1 },
      (err) => {
        if (err) {
          console.error("Error publishing message:", err);
        } else {
          setMessages([]);
        }
      }
    );
    mqttClient.unsubscribe(topic);
  };

  return (
    <section className="pb-3">
      <h1 className="msg">Admin Chat</h1>
      <p className="msg">Welcome {user.username}!</p>
      {joined ? (
        <>
          <section className="chat">
            {messages &&
              messages.map((msg, index) => (
                <div className="chat-msg" key={index}>
                  <span>{msg.sender}:</span> {msg.text}
                </div>
              ))}
          </section>
          <form className="form" onSubmit={sendMessage}>
            <label htmlFor="chat">
              {`${user.username}:`}
              <input
                className="ml-2"
                id="chat"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
            </label>
            <div className="buttons">
              <button
                type="button"
                className="small-btn"
                onClick={() => {
                  handleLeave();
                }}
              >
                Leave Chat
              </button>
              <button type="submit" className="big-btn">
                Send
              </button>
            </div>
          </form>
        </>
      ) : (
        <button onClick={() => handleJoin()} className="big-btn mx-auto">
          Join The Chat
        </button>
      )}
    </section>
  );
}
