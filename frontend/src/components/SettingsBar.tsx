import { useCallback, useEffect, useState } from 'react';
import {
  MdOutlinePauseCircleOutline,
  MdOutlinePlayCircleOutline,
} from 'react-icons/md';

import { HStack, Icon, Text } from '@chakra-ui/react';
import { Difficulty } from '@sudokuparty/shared/types';

import { formatSeconds, getGameElapsedTime } from '@/utils/helpers';
import { ONE_SEC } from './SudokuGrid/constants';

/**
 * This component displays the game timer and error count, with controls for pausing and resuming the game.
 */
export const SettingsBar = ({
  enablePause = false,
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
  const updateTimer = useCallback(
    () => setTimer(getGameElapsedTime(startedAt ?? 0, totalPausedMs)),
    [startedAt, totalPausedMs],
  );

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

    updateTimer();

    const timerId = setInterval(updateTimer, ONE_SEC);

    return () => clearInterval(timerId);
  }, [startedAt, completedAt, isPaused, pausedAt, totalPausedMs, updateTimer]);

  // callbacks
  const toggleGame = () => (isPaused ? resume?.() : pause?.());

  // render
  return (
    <HStack w="full" justify="space-between" align="center">
      <Text fontSize="sm" fontVariantNumeric="tabular-nums">
        <Text as="span" fontWeight="medium">
          difficulty:{' '}
        </Text>
        {difficulty}
      </Text>
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
