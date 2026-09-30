import { Controls } from '../Controls';
import { Game } from '../layout/Game';
import { INITIAL_REMAINING } from '../SudokuGrid/constants';
import { SudokuBoard } from '../SudokuGrid/SudokuBoard';

export const GameLoadingView = () => {
  return (
    <Game.Root>
      <Game.Status />
      <Game.Content>
        {/* main */}
        <Game.Main>
          {/* board */}
          <SudokuBoard puzzle={undefined} />
        </Game.Main>

        {/*  sidebar */}
        <Game.Sidebar>
          <Controls
            fillMode="digit"
            remaining={INITIAL_REMAINING}
            disabled
          />
        </Game.Sidebar>
      </Game.Content>
    </Game.Root>
  );
};
