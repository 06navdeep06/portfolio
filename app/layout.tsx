import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 to-gray-800 text-white`}>
        {children}
      </body>
    </html>
  );
}
