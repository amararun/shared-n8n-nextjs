'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MessageData {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Function to convert plain text to HTML
function formatMessage(content: string): string {
  let html = content;
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code
  html = html.replace(/`([^`]+)`/g, '<code style="background-color:#f0f0f0;padding:2px 4px;border-radius:3px;font-family:monospace;font-size:0.9em;">$1</code>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#3366cc;text-decoration:none;" target="_blank">$1</a>');
  
  // Lists
  html = html.replace(/^- (.*)/gm, '• $1');
  
  // Preserve newlines
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

export function ChatMessage({ message }: { message: MessageData }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current && message.role === 'assistant') {
      contentRef.current.innerHTML = formatMessage(message.content);
    }
  }, [message.content, message.role]);

  const formattedTime = new Date(message.timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isUserMessage = message.role === 'user';

  return (
    <div className={cn(
      "flex w-full my-2",
      isUserMessage ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] rounded-lg px-4 py-2",
        isUserMessage 
          ? "bg-indigo-600 text-white" 
          : "bg-gray-100 text-gray-900"
      )}>
        <div className="flex items-center mb-1">
          <div className="font-semibold">
            {isUserMessage ? 'You' : 'Assistant'}
          </div>
          <div className="text-xs ml-2 opacity-70">
            {formattedTime}
          </div>
        </div>
        
        {isUserMessage ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div 
            ref={contentRef}
            className="markdown"
          />
        )}
      </div>
    </div>
  );
}

export type { MessageData }; 