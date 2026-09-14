import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";

import { Provider } from '@/components/ui/provider';

/** fonts */
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/** browser metadata */
export const metadata: Metadata = {
  title: 'Sudoku Party',
  description: 'Multiplayer Sudoku - Collaborative Sudoku with friends',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
