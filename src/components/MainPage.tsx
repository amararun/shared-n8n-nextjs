'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from '@/components/ui/icons';
import MarkdownRenderer from '@/components/ui/markdown-renderer';
import { useLogger } from '@/providers/log-provider';
import { LogLevel } from '@/lib/log-service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function MainPage() {
  const { logs, addLog } = useLogger();
  const [expandedLogIndexes, setExpandedLogIndexes] = useState<Set<number>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analyst'); // Use analyst as default
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when logs change
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);
  
  // Toggle log details expansion
  const toggleLogExpansion = (index: number) => {
    setExpandedLogIndexes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

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
    
    // Log that we're sending a message
    addLog('info', `Sending message: "${input.length > 50 ? input.substring(0, 50) + '...' : input}"`);

    try {
      // Prepare the request payload
      const payload = {
        sessionId: 'session-123', // This should be managed properly in a real app
        input: input
      };
      
      // Log the request payload
      addLog('debug', 'Request payload:', payload);

      // Call the agent endpoint
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        addLog('error', `API error: ${response.status} ${response.statusText}`);
        throw new Error('Failed to get response from agent');
      }

      const data = await response.json();
      
      // Log the successful API response
      addLog('debug', 'API response received:', {
        status: response.status,
        data: data
      });

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Add success log
      addLog('info', 'Successfully received response', { 
        responseLength: data.response.length,
        timeMs: new Date().getTime() - new Date(timestamp).getTime()
      });
      
    } catch (error) {
      // Add error log
      addLog('error', error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setInput('');
      setIsLoading(false);
    }
  };

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return '🔵';
      case 'error':
        return '🔴';
      case 'warn':
        return '🟠';
      case 'debug':
        return '🟣';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Professional tab interface matching the new style */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('analyst')}
          className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'analyst' 
              ? 'text-indigo-600 border-indigo-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          AI General Analyst
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'logs' 
              ? 'text-indigo-600 border-indigo-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Logs ({logs.length})
        </button>
      </div>

      {/* Analyst Tab Content */}
      {activeTab === 'analyst' && (
        <Card className="p-6 shadow-sm border border-gray-100 rounded-xl">
          <div className="space-y-3 mb-4 h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`${
                    message.role === 'user'
                      ? 'max-w-[80%] bg-indigo-600 text-white rounded-tr-none'
                      : 'max-w-[95%] bg-white shadow-sm text-gray-800 border border-gray-100 rounded-tl-none'
                  } rounded-2xl px-4 py-3`}
                >
                  {message.role === 'assistant' ? (
                    <MarkdownRenderer 
                      content={message.content}
                      className={'px-0'}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  )}
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
                className="flex-1 rounded-full border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
              >
                <IconArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Logs Tab Content */}
      {activeTab === 'logs' && (
        <Card className="p-6 shadow-sm border border-gray-100 rounded-xl">
          <div className="space-y-2 h-[60vh] overflow-y-auto font-mono text-sm">
            {/* Simple log header */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-100">
              <p className="font-medium text-blue-700">Log Status: {logs.length} logs available</p>
              <p className="text-sm text-blue-600 opacity-80">
                First log: {logs.length > 0 ? logs[0].message : 'No logs'}
              </p>
            </div>
            
            {/* Log entries */}
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400 bg-gray-50 rounded-lg">
                  No logs available
                </div>
              ) : (
                logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg text-sm mb-2 border ${
                      log.level === 'error' ? 'bg-red-50 text-red-700 border-red-100' :
                      log.level === 'warn' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      log.level === 'debug' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="mr-2 mt-1">
                        {log.level === 'error' ? '🔴' : 
                         log.level === 'warn' ? '🟠' : 
                         log.level === 'debug' ? '🟣' : '🔵'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{log.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                        
                        {log.details && (
                          <div className="mt-2 p-2 bg-white rounded border text-xs overflow-x-auto">
                            <pre className="whitespace-pre-wrap">
                              {typeof log.details === 'string' 
                                ? log.details 
                                : JSON.stringify(log.details, null, 2)
                              }
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 