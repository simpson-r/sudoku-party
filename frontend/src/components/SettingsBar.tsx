import { IoPause, IoPlay } from 'react-icons/io5';

import { HStack, Icon, Text } from '@chakra-ui/react';

/**
 * This component displays the game timer and error count, with controls for pausing and resuming the game.
 */
export const SettingsBar = ({
  enablePause = false,
  errors = 0,
  hidePauseToggle = false,
  isPaused,
  time,
  pause,
  resume,
}: {
  enablePause?: boolean;
  isPaused: boolean;
  hidePauseToggle?: boolean;
  time: string;
  errors: number;
  pause?: VoidFunction;
  resume?: VoidFunction;
}) => {
  // callbacks
  const toggleGame = () => (isPaused ? resume?.() : pause?.());

  // render
  return (
    <HStack justify="center" align="center" gap={4}>
      <HStack align="center" gap={0}>
        <Text fontSize="sm" fontFamily="mono" fontVariantNumeric="tabular-nums">
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
      <Text fontSize="sm" fontFamily="mono">{`Errors: ${errors}`}</Text>
    </HStack>
  );
};
