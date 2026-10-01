import { useBreakpoints } from '@/hooks/use-device-breakpoints';
import { ActivityLog } from '../ActivityLog';
import { Controls } from '../Controls';
import { Game } from '../layout/Game';
import { Players } from '../Players';
import { INITIAL_REMAINING } from '../SudokuGrid/constants';
import { SudokuBoard } from '../SudokuGrid/SudokuBoard';
import { InviteLink } from '../InviteLink';
import { SettingsBar } from '../SettingsBar';
import { Difficulty } from '@shared/types';

/**
 * This component renders multiplayer sudoku game loading state by board is undefined
 */
export const GameLoadingView = ({ difficulty }: { difficulty: Difficulty }) => {
  const { isMobile } = useBreakpoints();
  return (
    <Game.Root>
      {isMobile && <InviteLink roomId="" isLoading />}
      <Game.Content>
        {/* main */}
        <Game.Main>
          <SettingsBar
            difficulty={difficulty}
            errors={0}
            time="00:00"
            hidePauseToggle
          />
          <SudokuBoard puzzle={undefined} />
        </Game.Main>
        {/*  sidebar */}
        <Game.Sidebar>
          {!isMobile && <InviteLink roomId="" isLoading />}
          <Controls fillMode="digit" remaining={INITIAL_REMAINING} disabled />
          <Players players={[]} isLoading />
          <ActivityLog isLoading />
        </Game.Sidebar>
      </Game.Content>
    </Game.Root>
  );
};
