import { IoPause, IoPlay } from 'react-icons/io5';

import { HStack, Icon, Text } from '@chakra-ui/react';
import { Difficulty } from '@sudokuparty/shared/types';
import { formatSeconds, getElapsedTime } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { ONE_SEC } from './SudokuGrid/constants';

/**
 * This component displays the game timer and error count, with controls for pausing and resuming the game.
 */
export const SettingsBar = ({
  enablePause = false,
  errors,
  difficulty,
  hidePauseToggle = false,
  isPaused = false,
  startedAt,
  completedAt,
  pause,
  resume,
}: {
  enablePause?: boolean;
  errors?: number;
  difficulty: Difficulty;
  hidePauseToggle?: boolean;
  isPaused?: boolean;
  startedAt: number | null;
  completedAt?: number | null;
  pause?: VoidFunction;
  resume?: VoidFunction;
}) => {
  const [timer, setTimer] = useState(0);
  // timer
  useEffect(() => {
    if (startedAt === null) return;

    if (completedAt !== null) {
      setTimer(getElapsedTime(startedAt, completedAt));
      return;
    }

    setTimer(getElapsedTime(startedAt));

    const timerId = setInterval(
      () => setTimer(getElapsedTime(startedAt)),
      ONE_SEC,
    );

    return () => clearInterval(timerId);
  }, [completedAt, startedAt]);
  // callbacks
  const toggleGame = () => (isPaused ? resume?.() : pause?.());

  // render
  return (
    <HStack w="full" justify="space-between" align="center" fontWeight="medium">
      <StatusItem label="difficulty">{difficulty}</StatusItem>
      {/* timer + single-player pause button */}
      <HStack align="center" gap={0}>
        <Text fontSize="sm" fontVariantNumeric="tabular-nums">
          {timer ? formatSeconds(timer) : '00:00'}
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

      {errors !== undefined && <StatusItem label="errors">{errors}</StatusItem>}
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
