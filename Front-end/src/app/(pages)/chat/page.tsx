"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Trash } from "lucide-react";
import Markdown from "react-markdown";
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import Header from "@/components/Header/Header";
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";

const cx = classNames.bind(styles);

interface ChatSession {
  sendMessage: (
    message: string
  ) => Promise<{ response: { text: () => string } }>;
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([
    {
      role: "model",
      parts: "Great to meet you. I'm Gemini, your chatbot.",
    },
  ]);
  const template = process.env.NEXT_PUBLIC_TEMPLATE || "gemini";
  console.log("Template: ", template);
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_APIKEY || "");
  const [chat, setChat] = useState<ChatSession | null>(null);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (!chat) {
      setChat(
        model.startChat({
          generationConfig: {
            maxOutputTokens: 4000,
          },
        })
      );
    }
  }, [chat, model]);

  async function chatting() {
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
      const result = await chat.sendMessage(input + template);
      const response = await result.response;
      const text = response.text();
      setLoading(false);
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        const updatedHistory = [...newHistory, { role: "model", parts: text }];

        // Save chat history to MongoDB
        fetch("http://127.0.0.1:5000/api/saveChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "exampleUserId123", // Replace with actual user ID
            messages: updatedHistory.map((item) => ({
              role: item.role,
              content: item.parts,
              timestamp: new Date(),
            })),
          }),
        }).catch((error) =>
          console.error("Failed to save chat history:", error)
        );

        return updatedHistory;
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      chatting();
    }
  }

  function reset() {
    setHistory([
      {
        role: "model",
        parts: "Great to meet you. I'm Gemini, your chatbot.",
      },
    ]);
    setInput("");
    setChat(null);
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("px-10")}>
        <Header />
      </div>

      <main className={cx("content", "py-10")}>
        <div className={cx("chat-container")}>
          <div className={cx("message-container")}>
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
