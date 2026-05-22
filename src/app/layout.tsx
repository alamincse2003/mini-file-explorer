import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ExplorerProvider } from '@/context/ExplorerContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mini File Explorer',
  description: 'A modern file explorer built with Next.js, TypeScript, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-app text-paragraph">
        <ExplorerProvider>{children}</ExplorerProvider>
      </body>
    </html>
  );
}
