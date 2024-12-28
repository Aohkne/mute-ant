//app/pages/api/users/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { User } from '@/types/user/user';

export async function GET() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
    
    const db = client.db('mute-ant');
    const collection = db.collection<User>('user_account');
    
    const users = await collection.find({}).toArray();
    
    await client.close();
    
    return NextResponse.json(users);
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
    const body: User = await request.json();
    
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
    
    const db = client.db('mute-ant');
    const collection = db.collection<User>('user_account');
    
    const result = await collection.insertOne(body);
    
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