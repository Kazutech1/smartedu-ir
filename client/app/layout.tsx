import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}