"use client";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

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
  const [sessionId, setSessionId] = useState<string>("");
  const [fileRetrievalStatus, setFileRetrievalStatus] = useState<{
    txt: boolean | null;
  }>({ txt: null });

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_APIKEY || "");
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      maxOutputTokens: 4000,
    },
  });

  const template =
    process.env.NEXT_PUBLIC_TEMPLATE ||
    "Nice to meet you. I'm mute-ant, your chatbot. Do you have any questions about deafness, sign language?";

  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }

    if (!chat) {
      initializeChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeChat = (): void => {
    try {
      setChat(
        model.startChat({
          generationConfig: {
            maxOutputTokens: 4000,
          },
          // Apply template only once during initialization
          history: [
            {
              role: "user",
              parts: [{ text: "Initialize with the following system prompt" }],
            },
            {
              role: "model",
              parts: [{ text: "I'm ready to help" }],
            },
            {
              role: "user",
              parts: [{ text: template }],
            },
            {
              role: "model",
              parts: [
                {
                  text: "Understood. I am now Mute-ant, an assistant specifically designed for the deaf and mute. I will follow all the guidelines provided.",
                },
              ],
            },
          ],
        })
      );
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    }
  };

  const resetChat = (): void => {
    setChat(null);
    initializeChat();
  };

  const fetchTxtFile = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url, {
        headers: {
          "Accept-Charset": "UTF-8",
        },
      });

      if (!response.ok) {
        console.warn(`Error loading TXT file: ${response.statusText}`);
        setFileRetrievalStatus((prev) => ({ ...prev, txt: false }));
        return "";
      }

      const text = await response.text();
      setFileRetrievalStatus((prev) => ({ ...prev, txt: true }));
      return text;
    } catch (error) {
      console.error("Error when loading TXT:", error);
      setFileRetrievalStatus((prev) => ({ ...prev, txt: false }));
      return "";
    }
  };

  const retrieveDocuments = async (query: string): Promise<string[]> => {
    const documentFiles = [
      { url: "/doc/text.txt", type: "txt" },
      { url: "/doc/word.txt", type: "txt" },
      { url: "/doc/definition.txt", type: "txt" },
    ];

    // Use decodeURIComponent to ensure proper UTF-8 handling in the query
    const decodedQuery = decodeURIComponent(query);

    const docsContent: string[] = await Promise.all(
      documentFiles.map(async (doc) => {
        if (doc.type === "txt") {
          return fetchTxtFile(doc.url);
        }
        return "";
      })
    );

    const validDocsContent = docsContent.filter(
      (content) => content.length > 0
    );

    // Use normalized strings for comparison to handle UTF-8 properly
    const normalizedQuery = decodedQuery.toLowerCase().normalize("NFC");

    const relevantDocs = validDocsContent.filter((content) => {
      const normalizedContent = content.toLowerCase().normalize("NFC");
      return normalizedContent.includes(normalizedQuery);
    });

    return relevantDocs;
  };

  // Thêm hàm mới để log phản hồi vào Google Sheets
  const logResponseToSheets = async (
    userMessage: string,
    aiResponse: string
  ): Promise<void> => {
    try {
      const response = await fetch("/api/log-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          userMessage,
          aiResponse,
          timestamp: new Date().toISOString(),
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to log response: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error logging response:", error);
    }
  };

  // Sửa đổi hàm sendMessageWithRAG để bao gồm logging
  const sendMessageWithRAG = async (message: string): Promise<ChatResponse> => {
    if (!chat) {
      throw new Error("Chat session not initialized.");
    }

    try {
      const retrievedDocs = await retrieveDocuments(message);

      let augmentedMessage = message;
      if (retrievedDocs.length > 0) {
        augmentedMessage = `Reference information:\n${retrievedDocs.join(
          "\n---\n"
        )}\n\nUser question: ${message}`;
      } else {
        console.log("No relevant documents found for augmentation");
      }

      const chatResponse = await chat.sendMessage(augmentedMessage);

      // Trích xuất text phản hồi của AI
      const aiResponseText = chatResponse.response.text();

      // Log phản hồi vào Google Sheets
      await logResponseToSheets(message, aiResponseText);

      return chatResponse;
    } catch (error) {
      console.error("Error in sendMessageWithRAG:", error);
      throw error;
    }
  };

  return {
    chat,
    resetChat,
    sendMessageWithRAG,
    fileRetrievalStatus,
    logResponseToSheets,
  };
}
