import { useCallback, useEffect, useReducer, useState } from 'react';

import { INITIAL_REMAINING } from '@/components/SudokuGrid/constants';
import { updateRemainingCounts } from '@/components/SudokuGrid/helpers';
import { MultiplayerConfig } from '@/components/SudokuGrid/types';
import { useWebSocket } from '@/context/WebSocketContext';
import { buildRemainingCounts } from '@/utils/helpers';
import { updateBoard } from '@shared/helpers';
import {
  CandidateUpdate,
  Cell,
  CellUpdate,
  CellPosition,
  GameErrorCode,
  PlayerInfo,
  RemainingCounts,
  ServerMessage,
} from '@shared/types';

// helpers
const getCellActivityMessage = (
  event: Extract<ServerMessage, { type: 'cell_updated' }>,
) => {
  const { row, col, value, player } = event;
  const position = `r${row + 1}c${col + 1}`;

  return value
    ? `${player.name} filled ${value} at ${position}`
    : `${player.name} cleared ${position}`;
};
// constants
const INITIAL_STATE = {
  board: undefined,
  players: [],
  remaining: INITIAL_REMAINING,
  log: [],
  completed: false,
  startedAt: 0,
  completedAt: null,
  error: null,
};

// types & interfaces
type BoardPayload = {
  board: Cell[][];
  remaining: RemainingCounts;
  startedAt: number;
};

type SudokuState = {
  board?: Cell[][];
  players: PlayerInfo[];
  remaining: RemainingCounts;
  log: string[];
  completed: boolean;
  startedAt: number;
  completedAt: number | null;
  error: GameErrorCode | null;
};

type Action =
  | { type: 'INIT_BOARD'; payload: BoardPayload }
  | { type: 'CLEAR_DIGIT'; payload: CellPosition }
  | { type: 'FILL_DIGIT'; payload: CellUpdate }
  | { type: 'ADD_CANDIDATE'; payload: CellUpdate }
  | { type: 'REMOVE_CANDIDATE'; payload: CandidateUpdate }
  | { type: 'SET_CANDIDATES'; payload: CandidateUpdate }
  | { type: 'SET_PLAYERS'; payload: PlayerInfo[] }
  | { type: 'ADD_ACTIVITY'; payload: string }
  | { type: 'COMPLETE'; payload: number }
  | { type: 'RESET' }
  | { type: 'ERROR'; payload: GameErrorCode };

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
      const { board, remaining, startedAt } = action.payload;
      return {
        ...state,
        board,
        remaining,
        startedAt,
      };
    case 'SET_PLAYERS': {
      const players = action.payload;
      return {
        ...state,
        players,
      };
    }
    case 'ADD_ACTIVITY': {
      const log = [...state.log, action.payload].slice(-3);
      return {
        ...state,
        log,
      };
    }
    case 'COMPLETE': {
      return {
        ...state,
        completed: true,
        completedAt: action.payload,
      };
    }

    case 'RESET': {
      return {
        ...state,
        ...INITIAL_STATE,
        startedAt: Date.now(),
        completedAt: null,
      };
    }
    case 'ERROR': {
      return {
        ...state,
        error: action.payload,
      };
    }
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
    ...INITIAL_STATE,
  });

  const [playerId, setPlayerId] = useState<string | undefined>(undefined);

  // handlers
  const handleMessage = useCallback((message: ServerMessage) => {
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
        const activity = getCellActivityMessage(message);

        dispatch({ type: 'ADD_ACTIVITY', payload: activity });

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
        const { game, players } = message;
        const { board } = game;

        dispatch({
          type: 'INIT_BOARD',
          payload: {
            board,
            remaining: buildRemainingCounts(board),
            startedAt: game.startedAt,
          },
        });
        dispatch({ type: 'SET_PLAYERS', payload: players });
        break;
      case 'identity':
        setPlayerId(message.playerId);

        break;
      case 'players':
        dispatch({ type: 'SET_PLAYERS', payload: message.players });
        break;
      case 'game_complete':
        dispatch({ type: 'COMPLETE', payload: message.completedAt });
        break;
      case 'player_joined': {
        dispatch({
          type: 'ADD_ACTIVITY',
          payload: `${message.player.name} joined`,
        });
        break;
      }
      case 'player_left': {
        dispatch({
          type: 'ADD_ACTIVITY',
          payload: `${message.playerName} left`,
        });
        break;
      }
      case 'error': {
        dispatch({ type: 'ERROR', payload: message.code });
        break;
      }
      default:
        break;
    }
  }, []);
  // subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribe(handleMessage);

    return unsubscribe;
  }, [subscribe, handleMessage]);

  // join room
  useEffect(() => {
    if (isConnected) {
      send({ type: 'join', roomId: config.roomId });
    }
  }, [isConnected, config.roomId, send]);

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

  const newGame = () => {
    dispatch({ type: 'RESET' });
    send({ type: 'new_game' });
  };

  return {
    state,
    playerId,
    actions: {
      clearCell,
      fillCell,
      addCandidate,
      removeCandidate,
      newGame,
    },
  };
};
