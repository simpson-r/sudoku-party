'use client';

import { useRouter } from 'next/navigation';

import { useDisclosure } from '@chakra-ui/react';

import { SetupConfig } from '@/components/SudokuGrid/types';
import { GameSetupModal } from '@/components/modals/GameSetupModal';
import { Difficulty } from '@shared/types';

const createRoomId = (difficulty: Difficulty) => {
  const difficultyCode = difficulty[0];
  const id = crypto.randomUUID().slice(0, 6);
  return `${difficultyCode}${id}`;
};

/**
 * This component is the entry point for the app
 * It renders the setup modal or appropriate game flow based on the selected player mode.
 */
export const LandingPage = () => {
  const router = useRouter();
  const setupModal = useDisclosure({ defaultOpen: true });

  const handleSubmit = (config: SetupConfig) => {
    if (config.mode === 'multi') {
      const roomId = createRoomId(config.difficulty);
      router.push(`/game/${roomId}`);
      return;
    }
    const params = new URLSearchParams({
      difficulty: config.difficulty,
      ...(config.name && { name: config.name }),
    });
    router.push(`/game?${params}`);
  };

  return (
    <>
      <GameSetupModal
        isOpen={setupModal.open}
        onSubmit={handleSubmit}
        isLoading={false}
      />
    </>
  );
};
