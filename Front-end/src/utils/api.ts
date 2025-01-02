interface ChatData {
    userId: string;
    message: string;
    timestamp: number;
}

export async function saveChatHistory(data: ChatData): Promise<void> {
    const response = await fetch("/api/saveChat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to save chat history");
    }
}
