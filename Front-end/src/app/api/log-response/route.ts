import { google } from "googleapis";
import { NextResponse } from "next/server";

// Google Sheets API credentials
const GOOGLE_PRIVATE_KEY =
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || "";
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || "";

// Function to authenticate with Google
const getGoogleAuth = () => {
  const auth = new google.auth.JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth;
};

// Function to append data to Google Sheet
const appendToSheet = async (values: string[][]) => {
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: "log!A:D", // Điều chỉnh theo cấu trúc sheet của bạn
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });

  return response.data;
};
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userMessage, aiResponse, timestamp, sessionId } = body;

    // Kiểm tra thông tin xác thực
    console.log("Client Email:", GOOGLE_CLIENT_EMAIL);
    console.log("Sheet ID:", GOOGLE_SHEET_ID);
    console.log(
      "Private key starts with:",
      GOOGLE_PRIVATE_KEY
        ? GOOGLE_PRIVATE_KEY.substring(0, 20) + "..."
        : "undefined"
    );

    // Format data for Google Sheets
    const values = [
      [
        timestamp || new Date().toISOString(),
        sessionId || "unknown",
        userMessage || "",
        aiResponse || "",
      ],
    ];

    try {
      const result = await appendToSheet(values);
      return NextResponse.json({ success: true, result }, { status: 200 });
    } catch (sheetError: any) {
      console.error(
        "Sheet API Error:",
        sheetError.errors || sheetError.message || sheetError
      );
      return NextResponse.json(
        {
          success: false,
          error: String(sheetError.message || sheetError),
          details: sheetError.errors,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error logging to Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
