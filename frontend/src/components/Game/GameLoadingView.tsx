import { ControlsSidebar } from '../ControlsSidebar';
import { Game } from '../layout/Game';
import { INITIAL_REMAINING } from '../SudokuGrid/constants';
import { SudokuBoard } from '../SudokuGrid/SudokuBoard';

export const GameLoadingView = () => {
  return (
    <Game.Root>
      <Game.Status />
      <Game.Content>
        {/* left sidebar */}
        <Game.Side />
        {/* board */}
        <SudokuBoard puzzle={undefined} />
        {/* right sidebar */}
        <Game.Side>
          <ControlsSidebar
            fillMode="digit"
            remaining={INITIAL_REMAINING}
            disabled
          />
        </Game.Side>
      </Game.Content>
    </Game.Root>
  );
};
