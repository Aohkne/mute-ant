import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs", "chat_logs.json");

export async function POST(req: Request) {
  try {
    const { userMessage, botResponse } = await req.json();

    if (!userMessage || !botResponse) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      userMessage,
      botResponse,
    };

    if (!fs.existsSync(logFilePath)) {
      fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
      fs.writeFileSync(logFilePath, JSON.stringify([logEntry], null, 2));
    } else {
      const existingLogs = JSON.parse(fs.readFileSync(logFilePath, "utf-8"));
      existingLogs.push(logEntry);
      fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2));
    }

    return NextResponse.json({ message: "Log saved successfully" });
  } catch (error) {
    console.error("Error writing log file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
