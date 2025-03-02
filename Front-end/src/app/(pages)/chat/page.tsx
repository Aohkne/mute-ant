"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, SquarePlus } from "lucide-react";
import Markdown from "react-markdown";
import Image from "next/image";

import { useChatSession } from "./useChatSession";
import Header from "@/components/Header/Header";
import NavChat from "@/components/NavChat/NavChat";

import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import { createConversation } from "@/redux/features/conversation";

import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { postMessage } from "@/redux/features/messages";
const cx = classNames.bind(styles);

interface MessageItem {
  role: string;
  parts: string;
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<MessageItem[]>([
    {
      role: "model",
      parts:
        "Rất hân hạnh được gặp bạn. Mình là mute-ant, chatbot của bạn. Bạn có muốn hỏi gì về khiếm thính, ngôn ngữ kí hiệu không?",
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

  const dispatch = useDispatch<AppDispatch>();

  // POST Conversation
  const { success: postConversation } = useSelector(
    (state: RootState) => state.postConversation
  );

  useEffect(() => {
    const createNewConversation = async () => {
      try {
        const response = await dispatch(createConversation()).unwrap();

        if (postConversation) {
          setConversationId(response.content.id);
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    };

    if (!conversationId) {
      createNewConversation();
    }
  }, [dispatch]);

  async function chatting(): Promise<void> {
    if (!input.trim() || !conversationId) return;

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

      // Use sendMessageWithRAG instead of sendMessage directly
      const result = await sendMessageWithRAG(userInput);
      const response = await result.response;
      const text = response.text();

      setLoading(false);
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        return [...newHistory, { role: "model", parts: text }];
      });

      // Post Message - user
      dispatch(
        postMessage({
          conversationId: conversationId,
          sender: "user",
          messageText: userInput,
          isActive: true,
        })
      );

      // Post Message - model
      dispatch(
        postMessage({
          conversationId: conversationId,
          sender: "model",
          messageText: text,
          isActive: true,
        })
      );
    } catch (error) {
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: "model",
          parts: "Oops! Đã xảy ra lỗi. Vui lòng thử lại.",
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
          "Rất hân hạnh được gặp bạn. Mình là mute-ant, chatbot của bạn. Bạn có muốn hỏi gì về khiếm thính, ngôn ngữ kí hiệu không?",
      },
    ]);
    setInput("");
    resetChat();

    // POST Conversation
    const createNewConversation = async () => {
      try {
        const response = await dispatch(createConversation()).unwrap();
        setConversationId(response.content.id);
        console.log(
          "New conversation created after reset:",
          response.content.id
        );
      } catch (error) {
        console.error("Error creating new conversation:", error);
      }
    };

    createNewConversation();
  }

  function handleSelectHistory(index: number): void {
    alert(`Bạn đã chọn lịch sử chat ${index + 1}`);
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
                        item.role !== "model"
                          ? "chat-text-user"
                          : "chat-text-bot"
                      )}
                    >
                      <Markdown>{item.parts}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cx("input-container")}>
            <button className={cx("reset-button")} onClick={reset}>
              <SquarePlus className={cx("icon-small")} />
            </button>
            <textarea
              value={input}
              spellCheck={false}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Bắt đầu trò chuyện..."
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
        </main>
      </div>
    </div>
  );
};

export default Chatbot;
