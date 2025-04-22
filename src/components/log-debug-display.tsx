'use client';

import { useLogger } from '@/providers/log-provider';
import { useState, useEffect } from 'react';

export default function LogDebugDisplay() {
  const { logs } = useLogger();
  const [mounted, setMounted] = useState(false);
  
  // Fix for hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div>Loading logs...</div>;
  }
  
  return (
    <div>
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <p className="font-medium">Log Status: {logs.length} logs available</p>
        <p className="text-sm text-blue-600">
          First log: {logs.length > 0 ? logs[0].message : 'No logs'}
        </p>
      </div>
      
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg text-sm ${
              log.level === 'error' ? 'bg-red-50 text-red-700' :
              log.level === 'warn' ? 'bg-yellow-50 text-yellow-700' :
              log.level === 'debug' ? 'bg-purple-50 text-purple-700' :
              'bg-blue-50 text-blue-700'
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
        ))}
        
        {logs.length === 0 && (
          <div className="p-4 bg-gray-50 text-center rounded-lg text-gray-500">
            No logs available
          </div>
        )}
      </div>
    </div>
  );
} 