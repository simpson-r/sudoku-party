'use client';

import { Button, Dialog, HStack, Stat, Text, VStack } from '@chakra-ui/react';
import { Difficulty } from '@shared/types';

type CompletionStats = {
  difficulty: Difficulty;
  errors: number;
  time: string;
};

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
  time,
  isOpen,
  onClose,
  onNewGame,
}: {
  errors: number;
  difficulty: Difficulty;
  time: string;
  isOpen: boolean;
  onClose: VoidFunction;
  onNewGame: VoidFunction;
}) => {
  const stats: CompletionStats = { difficulty, errors, time };

  // callbacks
  const renderDuration = () => {
    const timeParts = time.split(':');
    const [hours, mins, secs] =
      timeParts.length === 3 ? timeParts : [undefined, ...timeParts];

    return (
      <>
        {hours && (
          <>
            {hours}
            <Stat.ValueUnit>hr</Stat.ValueUnit>
          </>
        )}
        {mins}
        <Stat.ValueUnit>min</Stat.ValueUnit>
        {secs}
        <Stat.ValueUnit>sec</Stat.ValueUnit>
      </>
    );
  };

  // render
  return (
    <Dialog.Root
      placement="center"
      open={isOpen}
      lazyMount
      unmountOnExit
      onEscapeKeyDown={onClose}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          rounded="2xl"
          justifyContent="center"
          alignItems="center"
          bgColor="bg.subtle"
          maxW={400}
        >
          {/* header */}
          <Dialog.Header>
            <VStack>
              <Dialog.Title fontSize="xl" textAlign="center">
                Congratulations!
              </Dialog.Title>
              <Text fontSize="sm">
                Puzzle complete. Here&#39;s how you did.
              </Text>
            </VStack>
          </Dialog.Header>
          {/* stats */}
          <Dialog.Body w="9/12">
            <HStack justify="space-between">
              {COMPLETION_STATS.map(({ key, label }) => (
                <Stat.Root key={key} w="10" justifyContent="center">
                  <Stat.Label>{label}</Stat.Label>
                  <Stat.ValueText alignItems="baseline">
                    {key === 'time' ? renderDuration() : stats[key]}
                  </Stat.ValueText>
                </Stat.Root>
              ))}
            </HStack>
          </Dialog.Body>
          {/* modal footer */}
          <Dialog.Footer>
            <Button color="fg.inverted" onClick={onNewGame}>
              New game
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
