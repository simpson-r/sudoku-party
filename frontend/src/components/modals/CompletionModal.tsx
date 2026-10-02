'use client';

import { formatSeconds, getGameElapsedTime } from '@/utils/helpers';
import {
  Button,
  DataList,
  Dialog,
  Separator,
  Text,
  TextProps,
  VStack,
} from '@chakra-ui/react';
import { Difficulty, PlayerInfo } from '@sudokuparty/shared/types';

// types
type CompletionStats = {
  difficulty: Difficulty;
  errors?: number;
  time: string;
};

// constants
const COMPLETION_STATS: {
  label: string;
  key: keyof CompletionStats;
}[] = [
  { label: 'Difficulty', key: 'difficulty' },
  { label: 'Errors', key: 'errors' },
  { label: 'Duration', key: 'time' },
];

/**
 * This component displays the completed game's results and provides an action to start a new game.
 */
export const CompletionModal = ({
  errors,
  difficulty,
  isOpen,
  playerId,
  players,
  startedAt,
  totalPausedMs,
  completedAt,
  onClose,
  onNewGame,
}: {
  errors?: number;
  difficulty: Difficulty;
  isOpen: boolean;
  playerId?: string;
  players?: PlayerInfo[];
  startedAt: number;
  completedAt: number | null;
  totalPausedMs: number;
  onClose: VoidFunction;
  onNewGame: VoidFunction;
}) => {
  const time = formatSeconds(
    getGameElapsedTime(startedAt, totalPausedMs, completedAt || undefined),
  );
  const stats: CompletionStats = {
    difficulty,
    time,
    ...(errors && { errors }),
  };

  return (
    <Dialog.Root
      placement="center"
      open={isOpen}
      lazyMount
      unmountOnExit
      onEscapeKeyDown={onClose}
    >
      <Dialog.Backdrop bg="blackAlpha.800" />
      <Dialog.Positioner>
        <Dialog.Content
          justifyContent="center"
          alignItems="center"
          bgColor="bg.subtle"
          borderRadius="none"
          border="2px solid"
          borderColor="border.inverted"
          maxW={400}
        >
          {/* header */}
          <Dialog.Header>
            <VStack>
              <Dialog.Title
                fontSize="xl"
                fontFamily="heading"
                textAlign="center"
              >
                Congratulations!
              </Dialog.Title>
              <Text fontSize="sm">Puzzle complete. Here are the results:</Text>
            </VStack>
          </Dialog.Header>
          {/* stats */}
          <Dialog.Body w="9/12">
            <StatsLabel>Stats</StatsLabel>
            <DataList.Root orientation="horizontal" gap={1} py={2}>
              {COMPLETION_STATS.map(
                ({ label, key }) =>
                  stats[key] && (
                    <DataList.Item key={key}>
                      <DataList.ItemLabel>{label}</DataList.ItemLabel>
                      <DataList.ItemValue>{stats[key]}</DataList.ItemValue>
                    </DataList.Item>
                  ),
              )}
            </DataList.Root>

            <StatsLabel>Final Score</StatsLabel>
            <DataList.Root orientation="horizontal" gap={1} py={2}>
              {players?.map(({ id, name, score }) => (
                <DataList.Item key={id}>
                  <DataList.ItemLabel display="inline-flex" alignItems="center">
                    {name}
                    {playerId === id && (
                      <Text fontSize="2xs" color="fg.subtle">
                        {'(you)'}
                      </Text>
                    )}
                  </DataList.ItemLabel>
                  <DataList.ItemValue>{score}</DataList.ItemValue>
                </DataList.Item>
              ))}
            </DataList.Root>
          </Dialog.Body>
          {/* modal footer */}
          <Dialog.Footer>
            <Button color="fg.inverted" borderRadius="none" onClick={onNewGame}>
              new game
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

const StatsLabel = ({ children }: React.PropsWithChildren<TextProps>) => {
  return (
    <>
      <Text textStyle="label">{children}</Text>
      <Separator w="full" borderColor="border" />
    </>
  );
};
