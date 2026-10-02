import { useBreakpoints } from '@/hooks/use-device-breakpoints';
import { Difficulty } from '@sudokuparty/shared/types';
import { INITIAL_REMAINING } from '@sudokuparty/shared/constants';

import { ActivityLog } from '../ActivityLog';
import { Controls } from '../Controls';
import { Game } from '../layout/Game';
import { Players } from '../Players';
import { SudokuBoard } from '../SudokuGrid/SudokuBoard';
import { InviteLink } from '../InviteLink';
import { SettingsBar } from '../SettingsBar';

/**
 * This component renders multiplayer sudoku game loading state by board is undefined
 */
export const GameLoadingView = ({ difficulty }: { difficulty: Difficulty }) => {
  const { isCompactLayout } = useBreakpoints();
  return (
    <Game.Root>
      {isCompactLayout && <InviteLink roomId="" isLoading />}
      <Game.Content>
        {/* main */}
        <Game.Main>
          <Game.Status>
            <SettingsBar
              difficulty={difficulty}
              startedAt={null}
              hidePauseToggle
            />
          </Game.Status>

          <SudokuBoard puzzle={undefined} />
        </Game.Main>
        {/*  sidebar */}
        <Game.Sidebar>
          {!isCompactLayout && <InviteLink roomId="" isLoading />}
          <Controls fillMode="digit" remaining={INITIAL_REMAINING} disabled />
          <Players players={[]} isLoading />
          <ActivityLog isLoading />
        </Game.Sidebar>
      </Game.Content>
    </Game.Root>
  );
};
