import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { ChatHistory } from '@/types/chat/chat';

const connectDB = async () => {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
    return client;
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        const client = await connectDB();
        const db = client.db('mute-ant');
        const collection = db.collection<ChatHistory>('chat_history');
        
        const history = await collection
            .find({ userId })
            .sort({ updatedAt: -1 })
            .toArray();
        
        await client.close();
        
        return NextResponse.json(history);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { userId, messages } = await request.json();
        
        if (!userId || !messages) {
            return NextResponse.json(
                { error: 'userId and messages are required' },
                { status: 400 }
            );
        }

        const client = await connectDB();
        const db = client.db('mute-ant');
        const collection = db.collection<ChatHistory>('chat_history');
        
        const newHistory: ChatHistory = {
            _id: new ObjectId().toString(),
            userId,
            messages,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await collection.insertOne(newHistory);
        
        await client.close();
        
        return NextResponse.json(result);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}