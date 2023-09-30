import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { NextUIProviderComponent } from './providers/NextUIProviderComponent';

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ReactQueryProvider>
          <NextUIProviderComponent>{children}</NextUIProviderComponent>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
