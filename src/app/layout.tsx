import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/header-footer/app-header";
import AppFooter from "@/components/header-footer/app-footer";
import { LogProvider } from '@/providers/log-provider';

// Optimize Inter font loading with all weights we'll need
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Next.js AI Lite App",
  description: "AI with Next and AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        <LogProvider>
          <AppHeader 
            title="Analyze with AI"
            features={["PostGres", "MySQL", "Instant Database", "File2Database", "Export", "Logs"]}
            modelInfo={{ 
              name: "AI", 
              models: ["Claude Sonnet-3.7", "Gemini Flash 2.0", "Deepseek R1"] 
            }}
          />
          <main className="bg-slate-50 flex-grow">
            {children}
          </main>
          <AppFooter 
            name="Amar Harolikar" 
            title="Specialist - Decision Sciences & Applied Generative AI"
            links={[
              { text: "LinkedIn", url: "https://www.linkedin.com/in/amarharolikar" },
              { text: "rex.tigzig.com", url: "https://rex.tigzig.com" },
              { text: "tigzig.com", url: "https://tigzig.com" }
            ]}
          />
        </LogProvider>
      </body>
    </html>
  );
}