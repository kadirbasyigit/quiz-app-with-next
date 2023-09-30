import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ReactQueryProvider } from './ReactQueryProvider';
import { Providers } from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Next Quiz App',
  description: 'Nextjs 13 quiz app powered by contentful',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body className={poppins.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
