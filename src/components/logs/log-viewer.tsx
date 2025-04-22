'use client';

import { cn } from '@/lib/utils';

interface Log {
  level: 'info' | 'error' | 'warn';
  message: string;
  timestamp: string;
  details?: any;
}

interface LogViewerProps {
  logs: Log[];
  className?: string;
}

const LogIcon = ({ level }: { level: Log['level'] }) => {
  switch (level) {
    case 'info':
      return <span className="text-blue-500">ℹ️</span>;
    case 'error':
      return <span className="text-red-500">❌</span>;
    case 'warn':
      return <span className="text-yellow-500">⚠️</span>;
  }
};

const LogEntry = ({ log }: { log: Log }) => {
  const baseClasses = "p-3 rounded-lg border font-inter text-sm transition-colors";
  const levelClasses = {
    error: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    warn: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
  };

  return (
    <div className={cn(baseClasses, levelClasses[log.level])}>
      <div className="flex items-center gap-2">
        <LogIcon level={log.level} />
        <span className="font-medium opacity-90">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
        <span className="text-indigo-300">•</span>
        <span className="flex-1">{log.message}</span>
      </div>
      {log.details && (
        <pre className="mt-2 p-2 bg-white/50 rounded border-t border-current/10 text-xs overflow-x-auto">
          {JSON.stringify(log.details, null, 2)}
        </pre>
      )}
    </div>
  );
};

export function LogViewer({ logs, className }: LogViewerProps) {
  return (
    <div className={cn("space-y-2 overflow-y-auto px-4 py-2", className)}>
      {logs.map((log, index) => (
        <LogEntry key={index} log={log} />
      ))}
    </div>
  );
}

export type { Log }; 