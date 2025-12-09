import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SmartEdU - Academic Search',
  description: 'Information Retrieval System for Academic Resources',
  keywords: ['education', 'search', 'students', 'courses', 'documents'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}