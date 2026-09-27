import { Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import { LuPlay, LuPause } from 'react-icons/lu';

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
  /** callback */
  const toggleGame = () => (isPaused ? resume() : pause());

  /** render */
  return (
    <HStack justify="center" gap={4}>
      <Flex align="center" gap={0}>
        <Text fontSize="sm" fontVariantNumeric="tabular-nums">
          {`Time: ${time}`}
        </Text>
        <IconButton
          color="fg.info"
          minW="6"
          size="xs"
          variant="ghost"
          onClick={toggleGame}
          cursor="pointer"
          aria-label="Toggle game"
        >
          {hidePauseToggle ? undefined : isPaused ? <LuPlay /> : <LuPause />}
        </IconButton>
      </Flex>
      <Text fontSize="sm">{`Errors: ${errors}`}</Text>
    </HStack>
  );
};
