'use client';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  features?: string[];
  modelInfo?: {
    name: string;
    models: string[];
  };
}

export default function AppHeader({ title, features, modelInfo }: AppHeaderProps) {
  return (
    <header>
      <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 p-4 font-inter">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xl tracking-tight">
            <span className="text-white font-semibold">n8n</span>
            <span className="text-indigo-300/90">•</span>
            <span className="text-white font-semibold">MCP Server</span>
            <span className="text-indigo-300/90">•</span>
            <span className="text-white font-semibold">FastAPI</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-indigo-100 py-2 px-4 font-inter">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[13px] tracking-tight font-medium text-indigo-950">
            {features?.map((feature, index) => (
              <>
                <span key={feature}>{feature}</span>
                {index < features.length - 1 && (
                  <span className="text-indigo-300">•</span>
                )}
              </>
            ))}
          </div>
          
          {modelInfo && (
            <div className="flex items-center gap-2 text-[13px] font-medium text-indigo-950">
              {modelInfo.models.map((model, index) => (
                <>
                  <span key={model}>: {model}</span>
                  {index < modelInfo.models.length - 1 && (
                    <span className="text-indigo-300">•</span>
                  )}
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 