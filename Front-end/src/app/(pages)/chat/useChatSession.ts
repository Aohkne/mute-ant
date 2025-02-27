"use client";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from "pdfjs-dist";

// Cấu hình worker cho pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  // Hàm lấy nội dung file TXT
  const fetchTxtFile = async (url: string): Promise<string> => {
    const response = await fetch(url);
    return await response.text();
  };

  // Hàm lấy nội dung file PDF sử dụng pdfjs-dist
  const fetchPdfFile = async (url: string): Promise<string> => {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const retrieveDocuments = async (query: string): Promise<string[]> => {
    const documentFiles = [
      { url: '/doc/text.txt', type: 'txt' },
      { url: 'Front-end/public/doc/text.txt', type: 'pdf' },
      { url: './text.txt', type: 'txt' },
    ];

    console.log(documentFiles);
    
    // Lấy nội dung của từng file
    const docsContent: string[] = await Promise.all(
      documentFiles.map(async (doc) => {
        if (doc.type === 'txt') {
          return fetchTxtFile(doc.url);
        } else if (doc.type === 'pdf') {
          return fetchPdfFile(doc.url);
        }
        return '';
      })
    );

    // Lọc nội dung tài liệu dựa trên query
    return docsContent.filter(content => content.toLowerCase().includes(query.toLowerCase()));
  };

  // Hàm gửi message tích hợp RAG
  const sendMessageWithRAG = async (message: string): Promise<ChatResponse> => {
    // Lấy tài liệu liên quan dựa trên query
    const retrievedDocs = await retrieveDocuments(message);

    console.log(retrievedDocs);

    const augmentedMessage = retrievedDocs.length
      ? `Thông tin tham khảo:\n${retrievedDocs.join("\n")}\n\nCâu hỏi: ${message}`
      : message;

    if (chat) {
      return await chat.sendMessage(augmentedMessage);
    }
    throw new Error("Chưa khởi tạo phiên chat.");
  };

  return { chat, resetChat, sendMessageWithRAG };
}
