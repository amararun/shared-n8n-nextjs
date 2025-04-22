'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from '@/components/ui/icons';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Log {
  level: 'info' | 'error' | 'warn';
  message: string;
  timestamp: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const timestamp = new Date().toISOString();

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Prepare the request payload
      const payload = {
        sessionId: 'session-123', // This should be managed properly in a real app
        input: input
      };

      // Call the agent endpoint
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to get response from agent');
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Add a log entry
      const logEntry: Log = {
        level: 'info',
        message: 'Successfully processed user input',
        timestamp: new Date().toISOString()
      };

      setLogs(prev => [...prev, logEntry]);
    } catch (error) {
      // Add error log
      const errorLog: Log = {
        level: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
        timestamp: new Date().toISOString()
      };

      setLogs(prev => [...prev, errorLog]);
    } finally {
      setInput('');
      setIsLoading(false);
    }
  };

  const getLogIcon = (level: Log['level']) => {
    switch (level) {
      case 'info':
        return 'ℹ️';
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="analyst" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyst">Analyst</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="analyst" className="mt-4">
          <Card className="p-6">
            <div className="space-y-4 mb-4 h-[60vh] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <IconArrowUp />
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card className="p-6">
            <div className="space-y-2 h-[60vh] overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    log.level === 'error'
                      ? 'bg-red-50 text-red-700'
                      : log.level === 'warn'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  <span className="mr-2">{getLogIcon(log.level)}</span>
                  <span className="opacity-70">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="mx-2">-</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 