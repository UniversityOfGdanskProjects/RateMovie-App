"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";

export default function ProfilePage() {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}sse`
    );

    eventSource.onmessage = (event) => {
      const result = JSON.parse(event.data);
      console.log(result.quote);
      setQuote(result);
    };

    eventSource.onclose = () => {
      console.log("Server connection closed");
    };

    return () => {
      eventSource.close();
    };
  }, []);
  return (
    <section className="">
      <div className="backdrop-container">
        <div className="backdrop-info flex flex-col items-center">
          <div className="p-4 text-white rounded-lg">
            {quote && (
              <>
                <p className="italic text-2xl">{quote.quote}</p>
                <p className="opacity-70">~ {quote.director}</p>
              </>
            )}
          </div>
        </div>
        <div className="backdrop-gradient"></div>
        <img
          src={
            !quote
              ? "https://image.tmdb.org/t/p/original/8QXGNP0Vb4nsYKub59XpAhiUSQN.jpg"
              : quote.image
          }
          alt="Backdrop"
          className="backdrop opacity-75"
        />
      </div>
    </section>
  );
}
