'use client';

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from '@/components/ui/icons';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, type MessageData } from './message';
import { LogDisplay } from '../logs/log-display';

export default function Chat() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID
  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    console.log('Chat session initialized:', newSessionId);
    
    // Add a test markdown message for debugging
    const testMessage = {
      role: 'assistant' as const,
      content: `# Testing Markdown

**Bold text** and *italic text*

## Lists
- Item 1
- Item 2

## Code
\`\`\`javascript
const test = "Hello world";
console.log(test);
\`\`\`

> This is a blockquote

[Link example](https://example.com)

Inline code: \`const x = 123;\``,
      timestamp: new Date().toISOString()
    };
    
    setMessages([testMessage]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    
    // Add user message to chat
    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const payload = {
        sessionId: sessionId,
        action: 'sendMessage',
        chatInput: input
      };

      console.log('Sending message to agent:', payload);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('[DEBUG] Received response from agent:', data);
      
      // Extract the content from the response
      // Handle both object with output property and direct response
      let content = '';
      
      if (typeof data === 'object') {
        if (data.output && typeof data.output === 'string') {
          // Direct output field
          content = data.output;
        } else if (data.text && typeof data.text === 'string') {
          // Text field
          content = data.text;
        } else if (data.response && typeof data.response === 'string') {
          // Some n8n workflows return a response field
          content = data.response;
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          // Fallback: Stringify the entire object if we can't find a content field
          content = JSON.stringify(data, null, 2);
        }
      } else if (typeof data === 'string') {
        // Direct string response
        content = data;
      }
      
      // Ensure content is properly formatted for markdown
      // Escape any potential HTML tags that should be rendered as text
      content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      // Properly format code blocks if they seem to be missing backticks
      if (content.includes('```') === false && content.includes('    ')) {
        content = content.replace(/^( {4,}|\t+)(.+)$/gm, (match) => {
          return '\n```\n' + match.trimLeft() + '\n```\n';
        });
      }
      
      console.log('[DEBUG] Extracted content:', content);

      if (!content) {
        console.error('[DEBUG] No content extracted from the response');
        throw new Error('Could not extract content from response');
      }

      // Add assistant message to chat
      const assistantMessage = {
        role: 'assistant' as const,
        content,
        timestamp: new Date().toISOString()
      };
      
      console.log('[DEBUG] Adding message to chat:', JSON.stringify(assistantMessage, null, 2));
      console.log('[DEBUG] Message content type:', typeof content);
      console.log('[DEBUG] Sample content:', content.substring(0, 100));
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message to chat
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Sorry, there was an error processing your message.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setInput('');
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[calc(100vh-180px)] flex flex-col">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="w-full flex justify-center space-x-2 rounded-lg bg-gray-100/80 p-1">
              <TabsTrigger 
                value="chat" 
                className="flex-1 max-w-[200px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-all"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="logs"
                className="flex-1 max-w-[200px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-all"
              >
                Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4 flex flex-col h-[calc(100vh-280px)]">
              <div className="flex-1 overflow-y-auto px-4">
                <div className="space-y-4 pb-4">
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4"
                  >
                    <IconArrowUp className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="mt-4 h-[calc(100vh-280px)]">
              <LogDisplay />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 