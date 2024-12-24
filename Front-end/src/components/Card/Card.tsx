'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardProps {
  id: number;
  img: string;
  title: string;
  author: string;
  className?: string;
}

interface CardSubComponentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardSubComponentProps> = ({ children, className }) => (
  <div className={`text-left px-5 py-3 ${className || ''}`}>{children}</div>
);

export const CardTitle: React.FC<CardSubComponentProps> = ({ children, className }) => (
  <h3 className={`text-lg font-bold ${className || ''}`}>{children}</h3>
);

export const CardContent: React.FC<CardSubComponentProps> = ({ children, className }) => (
  <div className={`flex flex-col px-5 py-3 ${className || ''}`}>{children}</div>
);

export const Card: React.FC<CardProps> = ({ id, img, title, author, className }) => {
  return (
    <div className={`rounded-lg border border-gray-200 shadow-sm ${className || ''}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-video">
          <Image
            src={img}
            alt={`${title} thumbnail`}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="my-5 text-gray-600">
          {author}
        </div>
        <div className="mt-auto">
          <Link href={`/blog-detail/${id}`}>
            <div className="flex items-center group">
              <Button 
                variant="ghost" 
                className="hover:bg-gray-100"
              >
                DETAILS
              </Button>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </CardContent>
    </div>
  );
};

export default Card;