import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { NextUIProviderComponent } from './providers/NextUIProviderComponent';
import { ReactQueryProvider } from './providers/ReactQueryProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Quiz App',
  description: 'Simple quiz app built with nextjs 13',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={poppins.className}>
        <ReactQueryProvider>
          <NextUIProviderComponent>{children}</NextUIProviderComponent>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
