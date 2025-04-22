'use client';

import { useLogger } from '@/providers/log-provider';
import { useState } from 'react';

export function LogDisplay() {
  const { logs } = useLogger();
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="text-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Direct Log Display ({logs.length} logs)</h3>
        <button 
          className="text-xs bg-indigo-100 px-2 py-1 rounded"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-2 bg-white p-3 rounded shadow-sm overflow-y-auto max-h-[300px]">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs available</div>
          ) : (
            <div>
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`my-1 p-2 text-xs border-l-4 ${
                    log.level === 'error' ? 'border-red-500 bg-red-50' :
                    log.level === 'warn' ? 'border-yellow-500 bg-yellow-50' :
                    log.level === 'debug' ? 'border-purple-500 bg-purple-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-mono bg-gray-100 px-1 rounded mr-2">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="font-medium">
                      {log.level.toUpperCase()}: {log.message}
                    </span>
                  </div>
                  
                  {log.details && (
                    <pre className="bg-white p-1 text-xs mt-1 overflow-x-auto rounded">
                      {typeof log.details === 'string' 
                        ? log.details 
                        : JSON.stringify(log.details, null, 2)
                      }
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 