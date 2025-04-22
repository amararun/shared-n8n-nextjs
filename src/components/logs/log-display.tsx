'use client';

import { useEffect, useRef, useState } from 'react';
import { LogService } from '@/lib/log-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'warn';
  message: string;
  details?: any;
}

export function LogDisplay() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [formattedLogs, setFormattedLogs] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Subscribe to logs
  useEffect(() => {
    console.log('LogDisplay mounted');
    
    // Initialize LogService on component mount
    try {
      const logService = LogService.getInstance();
      const unsubscribe = logService.subscribe(newLogs => {
        console.log('Log subscriber called with', newLogs.length, 'logs');
        setLogs(newLogs);
        
        // Format logs as markdown
        if (newLogs.length > 0) {
          const markdownContent = newLogs.map(log => {
            const levelEmoji = {
              info: 'ℹ️',
              error: '❌',
              warn: '⚠️'
            }[log.level];

            let detailsBlock = '';
            if (log.details) {
              try {
                const formattedDetails = typeof log.details === 'object' 
                  ? JSON.stringify(log.details, null, 2)
                  : String(log.details);
                
                detailsBlock = `\n\`\`\`json\n${formattedDetails}\n\`\`\``;
              } catch (e) {
                detailsBlock = `\n\`\`\`\n${String(log.details)}\n\`\`\``;
              }
            }

            return `### ${levelEmoji} ${new Date(log.timestamp).toLocaleTimeString()}
${log.message}${detailsBlock}
`;
          }).join('\n\n');
          
          setFormattedLogs(markdownContent);
        }
      });
      
      // Don't forget to unsubscribe
      return () => {
        console.log('LogDisplay unmounting, unsubscribing');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing LogService:', error);
      return () => {};
    }
  }, []);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [formattedLogs]);

  if (!formattedLogs) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No logs available
      </div>
    );
  }

  return (
    <div 
      ref={logContainerRef} 
      className="h-full overflow-y-auto p-4"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h3: ({ children, ...props }) => (
            <h3 className="text-sm font-medium mt-4 mb-1 text-gray-600" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="font-medium text-sm mb-1" {...props}>
              {children}
            </p>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isJson = language === 'json';
            
            if (inline) {
              return (
                <code 
                  className="bg-gray-100 px-1 rounded text-xs font-mono" 
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <pre className={`p-2 rounded overflow-x-auto mb-2 ${isJson ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-800"}`}>
                <code className="text-xs font-mono whitespace-pre" {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full divide-y divide-gray-300 border text-xs" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="px-2 py-1 text-left text-xs font-medium uppercase bg-gray-100" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-2 py-1 text-xs border-t" {...props}>
              {children}
            </td>
          )
        }}
      >
        {formattedLogs}
      </ReactMarkdown>
    </div>
  );
} 