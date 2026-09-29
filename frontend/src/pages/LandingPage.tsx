'use client';

import { useState } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import { PlayerMode, SetupConfig } from '@/components/SudokuGrid/types';
import { SinglePlayerGame } from '@/components/Game/SinglePlayerGame';
import { MultiplayerGame } from '@/components/Game/MultiplayerGame';
import { GameSetupModal } from '@/components/modals/GameSetupModal';
import { SudokuBoard } from '@/components/SudokuGrid/SudokuBoard';
import { Game } from '@/components/layout/GameLayout';

/**
 * This component is the entry point for the Sudoku experience
 * It renders the setup modal or appropriate game flow based on the selected player mode.
 */
export const LandingPage = () => {
  const setupModal = useDisclosure({ defaultOpen: true });
  const [playerMode, setPlayerMode] = useState<PlayerMode | undefined>();

  const handleSubmit = (config: SetupConfig) => {
    setPlayerMode(config.mode);
    setupModal.onClose();
  };

  return (
    <>
      {playerMode === 'single' && <SinglePlayerGame />}
      {playerMode === 'multi' && <MultiplayerGame />}
      {!playerMode && (
        <Game.Root flex={0}>
          <Game.Status />
          <SudokuBoard placeholder />
        </Game.Root>
      )}
      <GameSetupModal
        isOpen={setupModal.open}
        onSubmit={handleSubmit}
        isLoading={false}
      />
    </>
  );
};
