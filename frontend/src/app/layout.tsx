import type { Metadata } from 'next';
import { Provider } from '../components/ui/provider';
import { geistMono, geistSans } from '../utils/theme';

/** browser metadata */
export const metadata: Metadata = {
  title: 'Sudoku Party',
  description: 'Multiplayer Sudoku - Collaborative Sudoku with friends',
};

/**
 * This component defines the root application layout, including global fonts and UI providers.
 */
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
