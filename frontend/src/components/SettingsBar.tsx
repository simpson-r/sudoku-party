import { IoPause, IoPlay } from "react-icons/io5";

import { Flex, HStack, IconButton, Text } from '@chakra-ui/react';

/**
 * This component displays the game timer and error count, with controls for pausing and resuming the game.
 */
export const SettingsBar = ({
  errors = 0,
  hidePauseToggle = false,
  isPaused,
  time,
  pause,
  resume,
}: {
  isPaused: boolean;
  hidePauseToggle?: boolean;
  time: string;
  errors: number;
  pause: VoidFunction;
  resume: VoidFunction;
}) => {
  /** callbacks */
  const toggleGame = () => (isPaused ? resume() : pause());

  /** render */
  return (
    <HStack justify="center" gap={4}>
      <Flex align="center" gap={0}>
        <Text fontSize="sm" fontVariantNumeric="tabular-nums">
          {`Time: ${time}`}
        </Text>
        <IconButton
          minW="6"
          size="xs"
          variant="ghost"
          onClick={toggleGame}
          cursor="pointer"
          aria-label="Toggle game"
        >
          {hidePauseToggle ? undefined : isPaused ? <IoPlay /> : <IoPause />}
        </IconButton>
      </Flex>
      <Text fontSize="sm">{`Errors: ${errors}`}</Text>
    </HStack>
  );
};
