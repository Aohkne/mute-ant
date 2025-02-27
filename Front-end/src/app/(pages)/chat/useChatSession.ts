"use client";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatResponse {
  response: {
    text: () => string;
  };
}

export interface ChatSession {
  sendMessage: (message: string) => Promise<ChatResponse>;
}

export function useChatSession() {
  const [chat, setChat] = useState<ChatSession | null>(null);
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_APIKEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    if (!chat) {
      initializeChat();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  const initializeChat = (): void => {
    setChat(
      model.startChat({
        generationConfig: {
          maxOutputTokens: 4000,
        },
      })
    );
  };

  const resetChat = (): void => {
    setChat(null);
  };

  return { chat, resetChat };
}