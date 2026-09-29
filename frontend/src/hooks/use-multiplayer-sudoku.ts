import { INITIAL_REMAINING, ONE_SEC } from '@/components/SudokuGrid/constants';
import { MultiplayerConfig } from '@/components/SudokuGrid/types';
import { useWebSocket } from '@/context/WebSocketContext';
import {
  buildRemainingCounts,
  formatSeconds,
  getElapsedTime,
} from '@/utils/helpers';
import { updateBoard } from '@shared/helpers';
import {
  Cell,
  CellPayload,
  CellPosition,
  PlayerInfo,
  RemainingCounts,
  ServerMessage,
} from '@shared/types';
import { useEffect, useReducer, useState } from 'react';

// types & interfaces
type BoardPayload = {
  board: Cell[][];
  remaining: RemainingCounts;
  startedAt: number;
};

type SudokuState = {
  board?: Cell[][];
  users: PlayerInfo[];
  remaining: RemainingCounts;
};

type Action =
  | { type: 'INIT_BOARD'; payload: BoardPayload }
  | { type: 'CLEAR_DIGIT'; payload: CellPosition }
  | { type: 'FILL_DIGIT'; payload: CellPayload }
  | { type: 'SET_USERS'; payload: PlayerInfo[] };

// reducer
export function reducer(state: SudokuState, action: Action): SudokuState {
  switch (action.type) {
    case 'FILL_DIGIT': {
      if (!state.board) return state;

      const { row, col, value } = action.payload;
      const prevCell = state.board?.[row][col];
      const { board, cell } = updateBoard(state.board, row, col, { value });

      const remaining = {
        ...state.remaining,
        [value]: state.remaining[value] - (prevCell.value !== value ? 1 : 0),
        ...(prevCell.value &&
          prevCell.value !== cell.value && {
            [prevCell.value]: state.remaining?.[prevCell?.value] + 1,
          }),
      };

      return {
        ...state,
        board,
        remaining,
      };
    }
    case 'CLEAR_DIGIT': {
      if (!state.board) return state;

      const { row, col } = action.payload;
      const prevCell = state.board[row][col];
      if (!prevCell.value) return state;

      const { board } = updateBoard(state.board, row, col, { value: null });

      return {
        ...state,
        board,
        remaining: {
          ...state.remaining,
          [prevCell.value]: state.remaining[prevCell.value] + 1,
        },
      };
    }
    case 'INIT_BOARD':
      const { board, remaining } = action.payload;
      return {
        ...state,
        board,
        remaining,
      };
    default:
      return state;
  }
}

/**
 * This hook manages multiplayer Sudoku game state, actions, and lifecycle.
 */
export const useMultiplayerSudoku = (config: MultiplayerConfig) => {
  const { isConnected, send, subscribe } = useWebSocket();
  const [state, dispatch] = useReducer(reducer, {
    board: undefined,
    users: [],
    remaining: INITIAL_REMAINING,
  });

  const [timer, setTimer] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  // subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribe(handleMessage);
    return unsubscribe;
  }, []);

  // join room
  useEffect(() => {
    if (isConnected) {
      send({
        type: 'join',
        name: config.name || '',
        roomId: config.roomId,
      });
    }
  }, [isConnected]);

  // timer
  useEffect(() => {
    if (startedAt === null) return;

    setTimer(getElapsedTime(startedAt));

    const timerId = setInterval(() => {
      setTimer(getElapsedTime(startedAt));
    }, ONE_SEC);

    return () => clearInterval(timerId);
  }, [startedAt]);

  // handlers
  const handleMessage = (message: ServerMessage) => {
    switch (message?.type) {
      case 'game_state':
        const { game } = message;
        const { board } = game;

        setStartedAt(game.startedAt);

        dispatch({
          type: 'INIT_BOARD',
          payload: {
            board,
            remaining: buildRemainingCounts(board),
            startedAt: game.startedAt,
          },
        });

        break;
        break;
      case 'players':
        dispatch({ type: 'SET_USERS', payload: message.players });
        break;
      case 'cell_updated':
        const { col, row, value } = message;

        if (value !== null) {
          dispatch({
            type: 'FILL_DIGIT',
            payload: { row, col, value },
          });
        } else {
          dispatch({
            type: 'CLEAR_DIGIT',
            payload: { row, col },
          });
        }
        break;
      default:
        break;
    }
  };

  // actions
  const clearCell = (payload: CellPosition) => {
    dispatch({ type: 'CLEAR_DIGIT', payload });
    send({ type: 'cell_update', value: null, ...payload });
  };

  const fillCell = (payload: CellPayload) => {
    dispatch({ type: 'FILL_DIGIT', payload });
    send({ type: 'cell_update', ...payload });
  };

  return {
    state,
    time: formatSeconds(timer),
    actions: {
      clearCell,
      fillCell,
    },
  };
};
