import { INITIAL_REMAINING, ONE_SEC } from '@/components/SudokuGrid/constants';
import { updateRemainingCounts } from '@/components/SudokuGrid/helpers';
import { MultiplayerConfig } from '@/components/SudokuGrid/types';
import { useWebSocket } from '@/context/WebSocketContext';
import {
  buildRemainingCounts,
  formatSeconds,
  getElapsedTime,
} from '@/utils/helpers';
import { updateBoard } from '@shared/helpers';
import {
  CandidateUpdate,
  Cell,
  CellUpdate,
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
};

type SudokuState = {
  board?: Cell[][];
  players: PlayerInfo[];
  remaining: RemainingCounts;
};

type Action =
  | { type: 'INIT_BOARD'; payload: BoardPayload }
  | { type: 'CLEAR_DIGIT'; payload: CellPosition }
  | { type: 'FILL_DIGIT'; payload: CellUpdate }
  | { type: 'ADD_CANDIDATE'; payload: CellUpdate }
  | { type: 'REMOVE_CANDIDATE'; payload: CandidateUpdate }
  | { type: 'SET_CANDIDATES'; payload: CandidateUpdate }
  | { type: 'SET_PLAYERS'; payload: PlayerInfo[] };

// reducer
export function reducer(state: SudokuState, action: Action): SudokuState {
  switch (action.type) {
    case 'CLEAR_DIGIT': {
      if (!state.board) return state;

      const { row, col } = action.payload;
      const prevCell = state.board[row][col];
      if (!prevCell.value) return state;

      const { board } = updateBoard(state.board, row, col, { value: null });

      return {
        ...state,
        board,
        remaining: updateRemainingCounts(state.remaining, prevCell.value, null),
      };
    }
    case 'FILL_DIGIT': {
      if (!state.board) return state;

      const { row, col, value } = action.payload;
      const prevCell = state.board?.[row][col];
      const { board, cell } = updateBoard(state.board, row, col, { value });

      return {
        ...state,
        board,
        remaining: updateRemainingCounts(
          state.remaining,
          prevCell.value,
          cell.value,
        ),
      };
    }
    case 'ADD_CANDIDATE': {
      if (!state.board) return state;

      const { row, col, value: candidate } = action.payload;
      const prevCell = state.board[row][col];

      const curCandidates = prevCell.candidates ?? [];
      if (curCandidates.includes(candidate)) return state;

      const candidates = [...curCandidates, candidate];
      const { board } = updateBoard(state.board, row, col, { candidates });

      return {
        ...state,
        board,
      };
    }

    case 'REMOVE_CANDIDATE': {
      if (!state.board) return state;

      const { row, col, candidates } = action.payload;
      const prevCell = state.board[row][col];

      const curCandidates = prevCell.candidates ?? [];
      const updatedCandidates = curCandidates.filter(
        (candidate) => !candidates.includes(candidate),
      );

      const { board } = updateBoard(state.board, row, col, {
        candidates: updatedCandidates,
      });

      return {
        ...state,
        board,
      };
    }

    case 'SET_CANDIDATES': {
      if (!state.board) return state;

      const { row, col, candidates } = action.payload;
      const { board } = updateBoard(state.board, row, col, {
        candidates,
      });

      return {
        ...state,
        board,
      };
    }
    case 'INIT_BOARD':
      const { board, remaining } = action.payload;
      return {
        ...state,
        board,
        remaining,
      };
    case 'SET_PLAYERS':
      const players = action.payload;
      return {
        ...state,
        players,
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
    players: [],
    remaining: INITIAL_REMAINING,
  });

  const [timer, setTimer] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);

  // subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribe(handleMessage);
    return unsubscribe;
  }, []);

  // join room
  useEffect(() => {
    if (isConnected) send({ type: 'join', roomId: config.roomId });
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
      case 'candidates_updated': {
        const { col, row, candidates } = message;

        dispatch({
          type: 'SET_CANDIDATES',
          payload: { row, col, candidates },
        });
        break;
      }
      case 'cell_updated': {
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
      }
      case 'game_state':
        const { game } = message;
        const { board } = game;

        setStartedAt(game.startedAt);

        dispatch({
          type: 'INIT_BOARD',
          payload: {
            board,
            remaining: buildRemainingCounts(board),
          },
        });

        break;
      case 'identity':
        setPlayerId(message.playerId);
        break;
      case 'players':
        dispatch({ type: 'SET_PLAYERS', payload: message.players });
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

  const fillCell = (payload: CellUpdate) => {
    dispatch({ type: 'FILL_DIGIT', payload });
    send({ type: 'cell_update', ...payload });
  };

  const addCandidate = (payload: CellUpdate) => {
    dispatch({ type: 'ADD_CANDIDATE', payload });
    send({
      type: 'candidate_add',
      row: payload.row,
      col: payload.col,
      candidate: payload.value,
    });
  };

  const removeCandidate = (payload: CandidateUpdate) => {
    dispatch({ type: 'REMOVE_CANDIDATE', payload });
    send({ type: 'candidate_remove', ...payload });
  };

  return {
    state,
    playerId,
    time: formatSeconds(timer),
    actions: {
      clearCell,
      fillCell,
      addCandidate,
      removeCandidate,
    },
  };
};
