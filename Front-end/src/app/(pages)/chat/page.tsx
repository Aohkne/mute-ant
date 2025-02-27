"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Trash } from "lucide-react";
import Markdown from "react-markdown";
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import Header from "@/components/Header/Header";
import Image from "next/image";
import { useChatSession } from "./useChatSession";

const cx = classNames.bind(styles);

interface MessageItem {
  role: string;
  parts: string;
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<MessageItem[]>([
    {
      role: "model",
      parts: "Rất hân hạnh được gặp bạn. Mình là mute-ant, chatbot của bạn. Bạn có muốn hỏi gì về khiếm thính, ngôn ngữ kí hiệu không?",
    },
  ]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const { chat, resetChat } = useChatSession();

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [history]);

  async function chatting(): Promise<void> {
    setLoading(true);
    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: input,
      },
      {
        role: "model",
        parts: "Thinking...",
      },
    ]);
    setInput("");
    try {
      if (!chat) {
        setLoading(false);
        setHistory((oldHistory) => {
          const newHistory = oldHistory.slice(0, oldHistory.length - 1);
          newHistory.push({
            role: "model",
            parts: "Chat session not initialized.",
          });
          return newHistory;
        });
        return;
      }

      const template = process.env.NEXT_PUBLIC_TEMPLATE || "You are Mute-ant, an assistant specifically designed for the deaf and mute.\n\n🌟 **Your mission:**\n- Always respond in Vietnamese, regardless of the input language.\n- All your answers should be related to sign language no matter what the question is.\n- Assist in finding information, answering questions, and providing guidance on issues related to deafness and muteness.\n- If the user wants to learn sign language, describe in detail **how to perform the hand gestures** to express the letter, word, or sentence they want to know.\n- If possible, provide illustrative images or video tutorials from reputable sources.\n- Respond politely, concisely, and clearly, avoiding technical jargon that may be confusing.\n- Do not answer questions unrelated to the topic of deafness and muteness.\n- At the end of each answer, add a few emoticons to create a friendly atmosphere.\n\n🔹 **Example responses:**\n\n❓ **User**: \"How do you say 'Hello' in sign language?\"\n✅ **You**: \"To say 'Hello' in Vietnamese Sign Language (VSL), do the following:\n1️⃣ Raise your right hand to your forehead, palm facing out.\n2️⃣ Slightly tilt your hand forward as if you are waving gently.\n3️⃣ Keep a smile on your face to create a friendly impression! 😊👋\n\n(You can see more illustrated instructions here: [attach link if available])\"\n\n❓ **User**: \"How to say 'Thank you' in sign language?\"\n✅ **You**: \"You can follow these steps:\n1️⃣ Bring the fingertips of your right hand close to your chin, palm facing in.\n2️⃣ Gently move your hand forward, as if you are pushing the thank you out.\n3️⃣ Combine with a smile to show sincerity. 😊🙏\n\n(You can see the illustrated image here: [attach link if available])\"\n\n🚀 **Be a dedicated and reliable assistant!** 😊";
      const result = await chat.sendMessage(input + template);
      const response = await result.response;
      const text = response.text();

      setLoading(false);
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        return [...newHistory, { role: "model", parts: text }];
      });
    } catch (error) {
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: "model",
          parts: "Oops! Something went wrong.",
        });
        return newHistory;
      });
      setLoading(false);
      console.error(error);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter") {
      e.preventDefault();
      chatting();
    }
  }

  function reset(): void {
    setHistory([
      {
        role: "model",
        parts: "Rất hân hạnh được gặp bạn. Mình là mute-ant, chatbot của bạn. Bạn có muốn hỏi gì về khiếm thính, ngôn ngữ kí hiệu không?",
      },
    ]);
    setInput("");
    resetChat();
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("px-10")}>
        <Header />
      </div>

      <main className={cx("content", "py-10")}>
        <div className={cx("chat-container")}>
          <div className={cx("message-container")} ref={messageContainerRef}>
            {history.map((item, index) => (
              <div
                key={index}
                className={cx(
                  "chat-message",
                  {
                    "message-start": item.role === "model",
                    "message-end": item.role !== "model",
                  },
                  {
                    user: item.role !== "model",
                  }
                )}
              >
                <div className={cx("avatar-container")}>
                  <div
                    className={cx("avatar-wrapper", {
                      user: item.role !== "model",
                    })}
                  >
                    <Image
                      alt={item.role === "model" ? "Gemini" : "User"}
                      src={
                        item.role === "model"
                          ? "/images/ant.png"
                          : "/images/author/LHK.png"
                      }
                      width={50}
                      height={50}
                      className={cx("avatar-image")}
                    />
                  </div>
                </div>

                <div
                  className={cx("message-bubble", {
                    user: item.role !== "model",
                  })}
                >
                  <div
                    className={cx(
                      item.role !== "model" ? "chat-text-user" : "chat-text-bot"
                    )}
                  >
                    <Markdown>{item.parts}</Markdown>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={cx("input-container")}>
            <button className={cx("reset-button")} onClick={reset}>
              <Trash className={cx("icon-small")} />
            </button>
            <textarea
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Start Chatting..."
              className={cx("chat-input", "text-title")}
            />
            <button
              className={cx("send-button", {
                loading: loading,
              })}
              onClick={chatting}
              disabled={loading}
            >
              {loading ? (
                <span className={cx("spinner")} />
              ) : (
                <Send className={cx("icon-small")} />
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;