import { HStack, Icon, IconButton, Span } from '@chakra-ui/react';
import { LuPlay, LuPause } from 'react-icons/lu';
import { ColorModeIcon, useColorMode } from './ui/color-mode';
export const SettingsBar = ({
  isPaused,
  time,
  pause,
  resume,
}: {
  isPaused: boolean;
  time: string;
  pause: VoidFunction;
  resume: VoidFunction;
}) => {
  const { toggleColorMode } = useColorMode();

  const toggleGame = () => {
    if (isPaused) {
      resume();
      return;
    }
    pause();
  };

  return (
    <HStack justify="space-between" align="center">
      <Span>
        {time}
        <IconButton
          color="fg.info"
          variant="ghost"
          onClick={toggleGame}
          cursor="pointer"
          aria-label="Toggle game"
        >
          {isPaused ? <LuPause /> : <LuPlay />}
        </IconButton>
      </Span>
      <IconButton
        color="fg.info"
        variant="ghost"
        onClick={toggleColorMode}
        cursor="pointer"
        aria-label="Toggle theme"
      >
        <ColorModeIcon />
      </IconButton>
    </HStack>
  );
};
