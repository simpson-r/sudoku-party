'use client';

import { SetupConfig } from '@/components/SudokuGrid/types';
import { SinglePlayerGame } from '@/components/Game/SinglePlayerGame';
import { MultiplayerGame } from '@/components/Game/MultiplayerGame';
import { WebSocketProvider } from '@/context/WebSocketContext';

/**
 * This component is the entry point for a sudoku game
 * It renders the appropriate game flow based on the selected player mode.
 */
export const GamePage = ({ config }: { config: SetupConfig }) => {
  return (
    <>
      {config.mode === 'single' && <SinglePlayerGame config={config} />}
      {config.mode === 'multi' && (
        <WebSocketProvider>
          <MultiplayerGame config={config} />
        </WebSocketProvider>
      )}
    </>
  );
};
