import { Difficulty } from '@sudokuparty/shared/types';
import { INITIAL_REMAINING } from '@sudokuparty/shared/constants';

import { ActivityLog } from '../ActivityLog';
import { Controls } from '../Controls';
import { Game } from '../layout/Game';
import { Scoreboard } from '../Scoreboard';
import { SudokuBoard } from '../SudokuGrid/SudokuBoard';
import { InviteLink } from '../InviteLink';
import { SettingsBar } from '../SettingsBar';
import { Box } from '@chakra-ui/react';

/**
 * This component renders the multiplayer game loading state while the board is unavailable
 */
export const GameLoadingView = ({ difficulty }: { difficulty: Difficulty }) => {
  return (
    <Game.Root>
      <Box display={{ base: 'block', lg: 'none' }} w="full">
        <InviteLink roomId="" isLoading />
      </Box>

      <Game.Content>
        {/* main */}
        <Game.Main>
          <Game.Status>
            <SettingsBar
              difficulty={difficulty}
              pausedAt={null}
              startedAt={null}
              totalPausedMs={0}
              hidePauseToggle
            />
          </Game.Status>
          <SudokuBoard board={undefined} />
        </Game.Main>
        {/*  sidebar */}
        <Game.Sidebar>
          <Box display={{ base: 'none', lg: 'block' }}>
            <InviteLink roomId="" isLoading />
          </Box>
          <Controls fillMode="digit" remaining={INITIAL_REMAINING} disabled />
          <Scoreboard players={[]} isLoading />
          <ActivityLog isLoading />
        </Game.Sidebar>
      </Game.Content>
    </Game.Root>
  );
};
