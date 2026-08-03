import { Chess, type Move } from "chess.js";

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};


function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function evaluateBoard(game: Chess): number {
  let score = 0;
  const board = game.board();

  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type] ?? 0;
      score += piece.color === "b" ? value : -value;
    }
  }

  if (game.isCheck()) {
    score += game.turn() === "w" ? -40 : 40;
  }

  return score;
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    if (game.isCheckmate()) {
      return maximizing ? -99999 : 99999;
    }
    if (game.isDraw()) return 0;
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true }) as Move[];

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const move of moves) {
    game.move(move);
    const evaluation = minimax(game, depth - 1, alpha, beta, true);
    game.undo();
    minEval = Math.min(minEval, evaluation);
    beta = Math.min(beta, evaluation);
    if (beta <= alpha) break;
  }
  return minEval;
}

function bestMinimaxMove(game: Chess, depth: number): Move {
  const moves = game.moves({ verbose: true }) as Move[];
  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    game.move(move);
    const score = minimax(game, depth - 1, -Infinity, Infinity, false);
    game.undo();
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function captureValue(move: Move): number {
  if (!move.captured) return 0;
  return PIECE_VALUES[move.captured] ?? 0;
}

function chooseMove(game: Chess, level: number): Move {
  const moves = game.moves({ verbose: true }) as Move[];
  if (moves.length === 0) {
    throw new Error("No legal moves");
  }

  if (level === 1) {
    return pickRandom(moves);
  }

  if (level === 2) {
    const captures = moves.filter((m) => m.captured);
    if (captures.length > 0 && Math.random() < 0.65) {
      return pickRandom(captures);
    }
    return pickRandom(moves);
  }

  if (level === 3) {
    const captures = moves.filter((m) => m.captured);
    if (captures.length > 0) {
      return captures.reduce((best, move) =>
        captureValue(move) > captureValue(best) ? move : best
      );
    }
    return pickRandom(moves);
  }

  const depthMap: Record<number, number> = {
    4: 1,
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 4,
    10: 5,
  };

  return bestMinimaxMove(game, depthMap[level] ?? 2);
}

export function getComputerMove(game: Chess, level: number): Move {
  const copy = new Chess(game.fen());
  return chooseMove(copy, level);
}
