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
  const [fileRetrievalStatus, setFileRetrievalStatus] = useState<{
    txt: boolean | null;
  }>({ txt: null });
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_APIKEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const template =
    process.env.NEXT_PUBLIC_TEMPLATE ||
    "You are Mute-ant, an assistant specifically designed for the deaf and mute...";

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
  };

  const resetChat = (): void => {
    setChat(null);
  };

  const fetchTxtFile = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);

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

    const relevantDocs = validDocsContent.filter((content) =>
      content.toLowerCase().includes(query.toLowerCase())
    );
    return relevantDocs;
  };

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

      return await chat.sendMessage(augmentedMessage);
    } catch (error) {
      console.error("Error in sendMessageWithRAG:", error);
      throw error;
    }
  };

  const testFileRetrieval = async (): Promise<{
    txtResult: string | null;
    success: boolean;
  }> => {
    try {
      const txtPath = "/doc/text.txt";
      const txtResult = await fetchTxtFile(txtPath);
      const success = txtResult.length > 0;

      return {
        txtResult: txtResult || null,
        success,
      };
    } catch (error) {
      console.error("Error testing file retrieval:", error);
      return {
        txtResult: null,
        success: false,
      };
    }
  };

  return {
    chat,
    resetChat,
    sendMessageWithRAG,
    fileRetrievalStatus,
    testFileRetrieval,
  };
}
