import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Sans_JP, Cinzel } from 'next/font/google';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import './globals.css';
import GlobalStyles from '@/components/GlobalStyles';

// Import cursor components with no SSR
const SamuraiCursor2 = dynamic(() => import('@/components/SamuraiCursor2'), {
  ssr: false,
});

const CursorStyles = dynamic(() => import('@/components/CursorStyles'), {
  ssr: false,
});

// Fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap'
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Navdeep - Portfolio',
  description: 'Personal portfolio of Navdeep - Full Stack Developer',
  keywords: ['portfolio', 'developer', 'full stack', 'web development', 'Navdeep'],
  authors: [{ name: 'Navdeep' }],
  themeColor: '#1f2937',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-portfolio-url.com',
    title: 'Navdeep - Portfolio',
    description: 'Personal portfolio of Navdeep - Full Stack Developer',
    siteName: 'Navdeep Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Navdeep - Portfolio',
    description: 'Personal portfolio of Navdeep - Full Stack Developer',
    creator: '@yourtwitterhandle',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className={`${inter.variable} ${notoSansJP.variable} ${cinzel.variable} font-sans bg-primary-black text-white min-h-screen overflow-x-hidden antialiased`}>
        <CursorStyles />
        <SamuraiCursor2 />
        {children}
        <GlobalStyles />
      </body>
    </html>
  );
}
