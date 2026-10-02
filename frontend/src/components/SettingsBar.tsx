import { IoPause, IoPlay } from 'react-icons/io5';

import { HStack, Icon, Text } from '@chakra-ui/react';
import { Difficulty } from '@sudokuparty/shared/types';
import { formatSeconds, getGameElapsedTime } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { ONE_SEC } from './SudokuGrid/constants';
import {
  MdOutlinePauseCircleOutline,
  MdOutlinePlayCircleOutline,
} from 'react-icons/md';

/**
 * This component displays the game timer and error count, with controls for pausing and resuming the game.
 */
export const SettingsBar = ({
  enablePause = false,
  errors,
  difficulty,
  hidePauseToggle = false,
  isPaused = false,
  totalPausedMs,
  pausedAt,
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
  pausedAt: number | null;
  totalPausedMs: number;
  startedAt: number | null;
  completedAt?: number | null;
  pause?: VoidFunction;
  resume?: VoidFunction;
}) => {
  const [timer, setTimer] = useState(0);
  // timer
  useEffect(() => {
    if (startedAt === null) return;

    if (isPaused && pausedAt !== null) {
      setTimer(getGameElapsedTime(startedAt, totalPausedMs, pausedAt));
      return;
    }

    if (completedAt !== null) {
      setTimer(getGameElapsedTime(startedAt, totalPausedMs, completedAt));
      return;
    }

    const updateTimer = () => {
      setTimer(getGameElapsedTime(startedAt, totalPausedMs));
    };

    updateTimer();

    const timerId = setInterval(updateTimer, ONE_SEC);

    return () => clearInterval(timerId);
  }, [startedAt, completedAt, isPaused, pausedAt, totalPausedMs]);

  // callbacks
  const toggleGame = () => (isPaused ? resume?.() : pause?.());

  // render
  return (
    <HStack w="full" justify="space-between" align="center">
      <StatusItem label="difficulty">{difficulty}</StatusItem>
      {/* timer + single-player pause button */}
      <HStack align="center" gap={1}>
        <Text fontSize="sm" fontVariantNumeric="tabular-nums">
          {timer ? formatSeconds(timer) : '00:00'}
        </Text>
        {enablePause && (
          <Icon
            boxSize={5}
            transform="translateY(1px)"
            display="block"
            onClick={toggleGame}
            cursor="pointer"
            aria-label={isPaused ? 'resume game' : 'pause game'}
          >
            {hidePauseToggle ? undefined : isPaused ? (
              <MdOutlinePlayCircleOutline />
            ) : (
              <MdOutlinePauseCircleOutline />
            )}
          </Icon>
        )}
      </HStack>
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
  <Text fontSize="sm" fontVariantNumeric="tabular-nums">
    <Text as="span" fontWeight="medium">
      {label}:{' '}
    </Text>
    {children}
  </Text>
);
