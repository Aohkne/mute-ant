export interface ChatHistory {
    _id: string;
    userId: string;
    messages: {
        role: 'user' | 'model';
        content: string;
        timestamp: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}