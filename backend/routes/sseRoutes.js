import express from "express";
import SseChannel from "sse-channel";

const sseRoutes = express.Router();
const quotes = [
  {
    quote:
      "The characters in my films try to live honestly and make the most of the lives they've been given. I believe you must live honestly and develop your abilities to the full. People who do this are the real heroes",
    director: "Akira Kurosawa",
    image:
      "https://image.tmdb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg",
  },
  {
    quote: "In film, we sculpt time, we sculpt behavior and we sculpt light.",
    director: "David Fincher",
    image:
      "https://image.tmdb.org/t/p/original/iwgl8zlrrfvfWp9k9Paj8lvFEvS.jpg",
  },
  {
    quote:
      "One of the things you do as a writer and as a filmmaker is grasp for resonant symbols and imagery without necessarily fully understanding it yourself.",
    director: "Christopher Nolan",
    image:
      "https://image.tmdb.org/t/p/original/ycnO0cjsAROSGJKuMODgRtWsHQw.jpg",
  },
  {
    quote:
      "We need storytelling. Otherwise, life just goes on and on like the number Pi.",
    director: "Ang Lee",
    image:
      "https://image.tmdb.org/t/p/original/gp9H4nb7F8BsawAlGw6PIgedidk.jpg",
  },
  {
    quote:
      "Making movies is little like walking into a dark room. Some people stumble across furniture, others break their legs but some of see better in the dark than others. The ultimate trick is to convince, persuade.",
    director: "Billy Wilder",
    image:
      "https://image.tmdb.org/t/p/original/rXb66PyOt8ztVaowy8i86C4gmdM.jpg",
  },
  {
    quote:
      "There are no rules in filmmaking. Only sins. And the cardinal sin is dullness.",
    director: "Frank Capra",
    image:
      "https://image.tmdb.org/t/p/original/z79IoYhLVSEpLRbVxeVxHRgdMw0.jpg",
  },
  {
    quote:
      "Film as dream, film as music. No art passes our conscience in the way film does, and goes directly to our feelings, deep down into the dark rooms of our souls.",
    director: "Ingmar Bergman",
    image:
      "https://image.tmdb.org/t/p/original/7tBfYcZH4P4AA1oFzjflUTSDZgx.jpg",
  },
  {
    quote:
      "A film is - or should be - more like music than like fiction. It should be a progression of moods and feelings. The theme, what's behind the emotion, the meaning, all that comes later.",
    director: "Stanley Kubrick",
    image:
      "https://image.tmdb.org/t/p/original/w5IDXtifKntw0ajv2co7jFlTQDM.jpg",
  },
  {
    quote:
      "An artist never works under ideal conditions. If they existed, his work wouldn't exist, for the artist doesn't live in a vacuum. Some sort of pressure must exist. The artist exists because the world is not perfect. Art would be useless if the world were perfect, as man wouldn't look for harmony but would simply live in it.",
    director: "Andrei Tarkovsky",
    image:
      "https://image.tmdb.org/t/p/original/6yrbWzzrPp7pwz6zHdifspJk8t3.jpg",
  },
  {
    quote:
      "If you're an artist, you want to draw from real life; you want to draw from experiences, emotion, and it's something that a lot of musicians juggle with. I've always found it so fascinating.",
    director: "Damien Chazelle",
    image:
      "https://image.tmdb.org/t/p/original/nofXR1TN1vgGjdfnwGQwFaAWBaY.jpg",
  },
  {
    quote:
      "I think cinema, movies, and magic have always been closely associated. The very earliest people who made film were magicians.",
    director: "Francis Ford Coppola",
    image:
      "https://image.tmdb.org/t/p/original/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg",
  },
  {
    quote:
      "One's memories aren't what actually happened - they're very subjective. You can always make it much better, right?",
    director: "Wong Kar-Wai",
    image:
      "https://image.tmdb.org/t/p/original/xmyEE9X057s4eNYktFjaEFNaILM.jpg",
  },
  {
    quote:
      "Rebellion is not always the right thing. Following the rules is not always the right thing. You have to think for yourself and identify the things that do not work for you.",
    director: "Yorgos Lanthimos",
    image:
      "https://image.tmdb.org/t/p/original/zJIxBe2HabDobtpxomhutwCya1W.jpg",
  },
];

const channel = new SseChannel({ cors: { origins: ["*"] }, jsonEncode: true });

setInterval(() => {
  const randomQuote = getRandomQuote();
  channel.send({ data: randomQuote });
}, 7000);

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

sseRoutes.get("/api/sse", (req, res) => {
  channel.addClient(req, res);

  req.on("close", () => {
    channel.removeClient(req, res);
  });
});

export default sseRoutes;
