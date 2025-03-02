"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Trash } from "lucide-react";
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import Image from "next/image";
import { useChatSession } from "./useChatSession";

import Header from "@/components/Header/Header";
import NavChat from "@/components/NavChat/NavChat";
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
      parts:
        "Nice to meet you. I'm mute-ant, your chatbot. Do you have any questions about deafness, sign language?",
    },
  ]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const { chat, resetChat, sendMessageWithRAG } = useChatSession();

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [history]);

  async function chatting(): Promise<void> {
    if (!input.trim()) return;

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
    const userInput = input;
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

      const result = await sendMessageWithRAG(userInput);
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
          parts: "Oops! Something went wrong. Please try again.",
        });
        return newHistory;
      });
      setLoading(false);
      console.error("Chat error:", error);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatting();
    }
  }

  function reset(): void {
    setHistory([
      {
        role: "model",
        parts:
          "Nice to meet you. I'm mute-ant, your chatbot. Do you have any questions about deafness, sign language?",
      },
    ]);
    setInput("");
    resetChat();
  }

  function handleSelectHistory(index: number): void {
    alert(`You choose the chat history ${index + 1}`);
  }

  return (
    <div className={cx("wrapper")}>
      <NavChat onSelectHistory={handleSelectHistory} />

      <div className={cx("chat")}>
        <div className={cx("px-10")}>
          <Header />
        </div>

        <main className={cx("content")}>
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
                        alt={item.role === "model" ? "Mute-ant" : "User"}
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
                        item.role !== "model"
                          ? "chat-text-user"
                          : "chat-text-bot"
                      )}
                    >
                      {item.parts}
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
                spellCheck={false}
                rows={1}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Start chatting..."
                className={cx("chat-input", "text-title")}
                lang="vi"
              />
              <button
                className={cx("send-button", {
                  loading: loading,
                })}
                onClick={chatting}
                disabled={loading || !input.trim()}
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
    </div>
  );
};

export default Chatbot;
