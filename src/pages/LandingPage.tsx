'use client';

import { Container, Heading, VStack } from '@chakra-ui/react';

import { SettingsBar } from '@/components/SettingsBar';
import { SudokuBoard } from '@/components/SudokuGrid/SudokuBoard';
import { useSudokuGame } from '@/hooks/use-sudoku-game';

export const LandingPage = () => {
  const {
    cellsPerBox,
    puzzle,
    state,
    time,
    clearCell,
    fillCell,
    pause,
    resume,
  } = useSudokuGame();

  return (
    <Container
      as={VStack}
      w="full"
      h="full"
      maxW="3xl"
      alignItems="center"
      justifyContent="center"
      py={12}
      gap={4}
    >
      <Heading size="3xl">sudoku party</Heading>
      <SettingsBar
        time={time}
        pause={pause}
        resume={resume}
        isPaused={state.paused}
      />
      <SudokuBoard
        cellsPerBox={cellsPerBox}
        puzzle={puzzle}
        clearCell={clearCell}
        fillCell={fillCell}
      />
    </Container>
  );
};
