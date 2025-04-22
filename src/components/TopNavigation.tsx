'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  ExternalLink,
  Database,
  Globe,
  FileText,
  FileDown,
  FileUp,
  ChartBar,
  Brain,
  FileCode,
  File as FilePdf,
  LineChart,
  RefreshCcw,
  Network,
  Share2,
  SplitSquareHorizontal,
  RefreshCw,
  Repeat,
  ArrowRightLeft,
  RotateCcw,
  RotateCw,
  HelpCircle,
  ChevronRight,
  type LucideProps
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';

// Add this constant at the top level
const SHOW_WEBHOOK_CONFIG = false; // Set to true when you want to show it again

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

interface Tool {
  id: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  color: string;
  href: string;
  description: string;
}

const tools: Tool[] = [
  { 
    id: 'analyzer', 
    name: 'Analyzer', 
    shortName: 'Analyze', 
    icon: Brain, 
    color: 'text-purple-600',
    href: 'https://rex.tigzig.com/analyzer',
    description: 'Connect to any database'
  },
  { 
    id: 'scraper', 
    name: 'Web Scraper', 
    shortName: 'Scrape', 
    icon: Globe, 
    color: 'text-green-600',
    href: 'https://rex.tigzig.com/web-scraper',
    description: 'AI Powered Dynamic Web Scraper'
  },
  { 
    id: 'llamaparse', 
    name: 'LlamaParse', 
    shortName: 'PDF Parse', 
    icon: FileText, 
    color: 'text-orange-500',
    href: 'https://rex.tigzig.com/llama-parse',
    description: 'Convert PDF to text with Llama Parse'
  },
  { 
    id: 'markdown', 
    name: 'Markitdown', 
    shortName: 'Markitdown', 
    icon: FileCode, 
    color: 'text-blue-600',
    href: 'https://rex.tigzig.com/markitdown',
    description: 'Convert any File to text with Markitdown'
  },
  { 
    id: 'mdtopdf', 
    name: 'MD to PDF', 
    shortName: 'MD2PDF', 
    icon: FilePdf, 
    color: 'text-red-600',
    href: 'https://rex.tigzig.com/md-to-pdf',
    description: 'Converting Markdown to PDF'
  },
  { 
    id: 'formui', 
    name: 'Form UI', 
    shortName: 'Form UI', 
    icon: LineChart, 
    color: 'text-emerald-600',
    href: 'https://rex.tigzig.com/ta-analysis',
    description: 'Form Based Technical Analysis'
  },
  { 
    id: 'excelui', 
    name: 'Excel UI', 
    shortName: 'Excel UI', 
    icon: ChartBar, 
    color: 'text-cyan-600',
    href: 'https://rex.tigzig.com/technical-analysis-report',
    description: 'Excel Based Technical Analysis'
  },
];

export default function TopNavigation() {
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isMobile } = useDeviceDetect();

  // Add global styles for scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getButtonStyles = (toolId: string) => {
    const styles = {
      analyzer: 'border-purple-100 bg-purple-50/50 hover:bg-purple-100/50',
      scraper: 'border-green-100 bg-green-50/50 hover:bg-green-100/50',
      llamaparse: 'border-orange-100 bg-orange-50/50 hover:bg-orange-100/50',
      markdown: 'border-blue-100 bg-blue-50/50 hover:bg-blue-100/50',
      mdtopdf: 'border-red-100 bg-red-50/50 hover:bg-red-100/50',
      formui: 'border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/50',
      excelui: 'border-cyan-100 bg-cyan-50/50 hover:bg-cyan-100/50',
    };
    return styles[toolId as keyof typeof styles] || '';
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      // Add webhook testing logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Webhook test successful!');
      setIsDialogOpen(false);
    } catch (error) {
      alert('Webhook test failed!');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Main Header */}
      <div className="flex flex-col">
        <div className={`bg-gradient-to-r from-indigo-950 to-indigo-900 ${isMobile ? 'p-2.5' : 'p-4'} font-inter`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            {/* Main header content */}
            <div className={`flex items-center gap-2 text-lg tracking-tight ${isMobile ? 'text-base' : 'text-xl'}`}>
              <span className={`text-white font-semibold ${isMobile ? 'text-lg' : 'text-2xl'}`}>AI Technical Analysis</span>
              {isMobile && <span className="text-indigo-300/90">|</span>}
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">n8n</span>
                <ArrowRightLeft className={`${isMobile ? 'h-3.5 w-3.5' : 'h-5 w-5'} text-indigo-300/90`} strokeWidth={2} />
                <span className="text-white font-semibold">MCP Server</span>
                {!isMobile && (
                  <>
                    <ArrowRightLeft className={`h-5 w-5 text-indigo-300/90`} strokeWidth={2} />
                    <span className="text-white font-semibold">FastAPI</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Header */}
        <div className="bg-white border-b border-indigo-100 py-2 px-4 font-inter">
          <div className="flex items-center justify-between">
            {/* Navigation Items */}
            <div className={`overflow-x-auto flex-1 hide-scrollbar ${isMobile ? 'overflow-y-auto max-h-24' : ''}`}>
              <div className={`flex items-center flex-wrap gap-2 text-[13px] tracking-tight font-medium text-indigo-950 
                ${!isMobile && 'whitespace-nowrap'}`}>
                {[
                  ...(isMobile 
                    ? ['PDF Report', 'Web Report']
                    : [
                        'AI Technical Analysis',
                        'Extract Data from Yahoo Finance',
                        'PDF Report',
                        'Web Report',
                        'Gemini-2.0-Flash',
                        'GPT-4.1'
                      ]
                  )
                ].map((item, index, array) => (
                  <div key={item} className="flex items-center">
                    <span>{item}</span>
                    {index < array.length - 1 && (
                      <span className={`text-indigo-300/60 mx-2 ${isMobile ? 'text-[10px]' : 'mx-1'}`}>•</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="p-4 border-b border-gray-200 bg-white">
        {isMobile ? (
          // Mobile view - filter out specific tools
          <>
            <div className="flex items-center gap-1.5 w-full">
              {tools
                .filter(tool => !['markdown', 'mdtopdf', 'formui', 'excelui', 'llamaparse'].includes(tool.id))
                .map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <a
                      key={tool.id}
                      href={tool.href}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex"
                      title={tool.description}
                    >
                      <Button
                        variant="outline"
                        className={`h-8 text-sm px-2 py-0 rounded-xl ${getButtonStyles(tool.id)}`}
                      >
                        <Icon className={`h-3.5 w-3.5 mr-1.5 ${tool.color}`} />
                        {tool.id === 'llamaparse' && isMobile ? 'Parse' : tool.shortName}
                      </Button>
                    </a>
                  );
                })}

              <Button
                variant="default"
                className="rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white shadow-sm transition-all duration-200 border-0 font-medium h-8 px-4 py-0"
                onClick={() => window.open('https://rex.tigzig.com/mcp-server-technical-analysis', '_blank')}
              >
                <Database className="mr-2 h-3.5 w-3.5 text-white" />
                MCP
              </Button>

              <a 
                href="https://rex.tigzig.com/mcp-technical-analysis"
                target="_blank"
                rel="noopener"
              >
                <Button
                  variant="default"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 border-0 font-medium h-8 px-4 py-0"
                >
                  <HelpCircle className="mr-2 h-3.5 w-3.5 text-white" />
                  {isMobile ? 'Docs' : 'Help & Build Guide'}
                </Button>
              </a>
            </div>
          </>
        ) : (
          // Desktop view
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <a
                    key={tool.id}
                    href={tool.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex"
                    title={tool.description}
                  >
                    <Button
                      variant="outline"
                      className={`rounded-xl ${getButtonStyles(tool.id)}`}
                    >
                      <Icon className={`h-3.5 w-3.5 mr-1.5 ${tool.color}`} />
                      {tool.shortName}
                    </Button>
                  </a>
                );
              })}
            </div>
            <div className="flex items-center space-x-3 ml-auto">
              <Button
                variant="default"
                className="rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white shadow-sm transition-all duration-200 border-0 font-medium h-8 px-4 py-0"
                onClick={() => window.open('https://rex.tigzig.com/mcp-server-technical-analysis', '_blank')}
              >
                <Database className="mr-2 h-3.5 w-3.5 text-white" />
                MCP Servers
              </Button>

              <a 
                href="https://rex.tigzig.com/mcp-technical-analysis"
                target="_blank"
                rel="noopener"
              >
                <Button
                  variant="default"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 border-0 font-medium h-8 px-4 py-0"
                >
                  <HelpCircle className="mr-2 h-3.5 w-3.5 text-white" />
                  {isMobile ? 'Docs' : 'Help & Build Guide'}
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 