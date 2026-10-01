import { IoPause, IoPlay } from 'react-icons/io5';

import { HStack, Icon, Text } from '@chakra-ui/react';
import { Difficulty } from '@shared/types';

/**
 * This component displays the game timer and error count, with controls for pausing and resuming the game.
 */
export const SettingsBar = ({
  enablePause = false,
  errors = 0,
  difficulty,
  hidePauseToggle = false,
  isPaused = false,
  time,
  pause,
  resume,
}: {
  enablePause?: boolean;
  errors: number;
  difficulty: Difficulty;
  hidePauseToggle?: boolean;
  isPaused?: boolean;
  time: string;

  pause?: VoidFunction;
  resume?: VoidFunction;
}) => {
  // callbacks
  const toggleGame = () => (isPaused ? resume?.() : pause?.());

  // render
  return (
    <HStack w="full" justify="space-between" align="center" fontWeight="medium">
      <StatusItem label="difficulty">{difficulty}</StatusItem>

      <HStack align="center" gap={0}>
        <Text fontSize="sm" fontVariantNumeric="tabular-nums">
          {time}
        </Text>

        {enablePause && (
          <Icon
            minW={5}
            size="sm"
            onClick={toggleGame}
            cursor="pointer"
            aria-label="Toggle game"
          >
            {hidePauseToggle ? undefined : isPaused ? <IoPlay /> : <IoPause />}
          </Icon>
        )}
      </HStack>

      <StatusItem label="errors">{errors}</StatusItem>
    </HStack>
  );
};

const StatusItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Text fontSize="sm" fontVariantNumeric="tabular-nums" fontWeight="400">
    <Text as="span" fontWeight="medium">
      {label}:{' '}
    </Text>
    {children}
  </Text>
);
