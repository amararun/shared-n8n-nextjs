'use client';

interface FooterLink {
  text: string;
  url: string;
}

interface AppFooterProps {
  name: string;
  title: string;
  links?: FooterLink[];
}

export default function AppFooter({ name, title, links }: AppFooterProps) {
  return (
    <footer className="bg-white/50 border-t border-indigo-100 py-2 mt-8 text-sm text-indigo-950/70 text-center">
      <div className="container mx-auto px-4">
        {name} <span className="mx-1.5 text-indigo-300">•</span> {title}
        
        {links && links.length > 0 && (
          <div className="mt-1">
            {links.map((link, index) => (
              <span key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  {link.text}
                </a>
                {index < links.length - 1 && (
                  <span className="mx-1.5 text-indigo-300">•</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
} 