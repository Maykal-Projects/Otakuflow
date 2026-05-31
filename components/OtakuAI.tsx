"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";
import { MessageCircle, X } from "lucide-react";

export default function OtakuAI() {

  const [open, setOpen] =
    useState(false);

  const [input, setInput] =
    useState("");

const [loading, setLoading] =
  useState(false);

const messagesEndRef =
  useRef<HTMLDivElement>(null);

  const [messages, setMessages] =
    useState<
      {
        role: string;
        content: string;
      }[]
    >([
      {
        role: "assistant",
        content:
          "Hey! I'm Otaku AI ✨ Ask me for anime recommendations, watch orders, or anything anime related.",
      },
    ]);

    useEffect(() => {

  messagesEndRef.current
    ?.scrollIntoView({
      behavior: "smooth",
    });

}, [messages, loading]);
    
  function sendMessage() {
if (loading) return;
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);

    setInput("");
    
setLoading(true);

    fetch("/api/chat", {

  method: "POST",

  headers: {
    "Content-Type":
      "application/json",
  },

  body: JSON.stringify({
    messages: [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ],
  }),

})
  .then(async (res) => {

    const data =
      await res.json();

    if (!res.ok) {

      throw new Error(
        data.message ||
        "AI request failed"
      );

    }

    return data;

  })

  .then((data) => {

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          data.message,
      },
    ]);

    setLoading(false);

  })

  .catch((error) => {

    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Otaku AI is overloaded right now 😭 Try again in a few seconds.",
      },
    ]);

    setLoading(false);

  });


  }

  return (

    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="fixed bottom-4 right-10 z-[999999999] w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-violet-500 border-4 border-white flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.8)] transition hover:scale-110"
      >

        {open ? (
          <X size={30} />
        ) : (
          <MessageCircle size={30} />
        )}

      </button>

      {/* CHAT WINDOW */}
      {open && (

        <div className="fixed bottom-20 sm:bottom-28 right-3 z-[999999] w-[92vw] max-w-[340px] sm:w-[600px] h-[58vh] sm:h-[540px] rounded-3xl border border-white/10 bg-black shadow-[0_0_40px_rgba(168,85,247,0.25)] overflow-hidden flex flex-col">

          {/* HEADER */}
          <div className="p-4 border-b border-white/10 flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center font-black">
              ✨
            </div>

            <div>
              <h2 className="font-black">
                Otaku AI
              </h2>

              <p className="text-xs text-zinc-400">
                Anime Assistant
              </p>
            </div>

          </div>

          {/* SUGGESTIONS */}
<div className="px-4 pt-4 flex flex-wrap gap-2">

{[
  "Top rated anime",
  "Most popular anime",
  "Best anime this season",
  "Anime like Monster",
  "Top romance anime",
  "Fate watch order",
].map((prompt) => (

    <button
      key={prompt}
      onClick={() =>
        setInput(prompt)
      }
      className="text-xs px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/40 transition"
    >

      {prompt}

    </button>

  ))}

</div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {messages.map(
              (msg, i) => (

                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role ===
                    "user"
                      ? "ml-auto bg-violet-500 text-white"
                      : "bg-white/5 border border-white/10"
                  }`}
                >

                  {msg.content}

                </div>

              )
            )}

{loading && (

  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-white/5 border border-white/10">

    <div className="flex gap-1">

      <span className="animate-bounce">
        •
      </span>

      <span
        className="animate-bounce"
        style={{
          animationDelay:
            "0.15s",
        }}
      >
        •
      </span>

      <span
        className="animate-bounce"
        style={{
          animationDelay:
            "0.3s",
        }}
      >
        •
      </span>

    </div>

  </div>

)}
<div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-white/10 flex gap-2 items-center">

            <input
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key ===
                  "Enter"
                ) {

                  sendMessage();

                }

              }}
              placeholder="Ask Otaku AI..."
              className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-2xl px-4 py-3"
            />

            <button
              onClick={sendMessage}
              className="min-w-[78px] h-[50px] rounded-2xl bg-violet-500 font-bold text-sm flex items-center justify-center"
            >
              Send
            </button>

          </div>

        </div>

      )}

    </>
  );
}