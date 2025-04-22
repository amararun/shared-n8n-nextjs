import './globals.css'
import { Inter } from 'next/font/google'
import { LogProvider } from '@/providers/log-provider'
import TopNavigation from '@/components/TopNavigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI General Analyst',
  description: 'Your AI-powered general analysis assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LogProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <TopNavigation />

            {/* Main content */}
            <main>
              {children}
            </main>
          </div>
        </LogProvider>
      </body>
    </html>
  )
}
