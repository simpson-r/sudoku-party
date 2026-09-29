'use client';

import { useRouter } from 'next/navigation';


import { useDisclosure } from '@chakra-ui/react';

import { SetupConfig } from '@/components/SudokuGrid/types';
import { GameSetupModal } from '@/components/modals/GameSetupModal';
import { SudokuBoard } from '@/components/SudokuGrid/SudokuBoard';
import { Game } from '@/components/layout/Game';

/**
 * This component is the entry point for the app
 * It renders the setup modal or appropriate game flow based on the selected player mode.
 */
export const LandingPage = () => {
  const router = useRouter();
  const setupModal = useDisclosure({ defaultOpen: true });

  const handleSubmit = (config: SetupConfig) => {
    const params = new URLSearchParams(config);
    router.push(`/game?${params.toString()}`);
  };

  return (
    <>
      <Game.Root flex={0}>
        <Game.Status />
        <SudokuBoard placeholder />
      </Game.Root>
      <GameSetupModal
        isOpen={setupModal.open}
        onSubmit={handleSubmit}
        isLoading={false}
      />
    </>
  );
};
