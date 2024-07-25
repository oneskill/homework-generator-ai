import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Language Assessment Platform',
  description: 'Interactive platform for language learning assessments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto mt-8">
          {children}
        </main>
      </body>
    </html>
  );
}