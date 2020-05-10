import ChessAI from '@/ChessAI';
import { ChessInstance, ShortMove, Move } from 'chess.js';
const Chess = require('chess.js');

export default class Negamax extends ChessAI {
    /**
     * The pieces value heuristic
     * - "p" for Pawn
     * - "n" for Knight
     * - "b" for Bishop
     * - "r" for Rook
     * - "q" for Queen
     * - "k" for King
     */
    private readonly piecesValues = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 100
    };

    private depth: number;

    constructor(depth = 2) {
        super();
        this.depth = depth;
    }

    public getBestMove(game: ChessInstance): ShortMove | null {
        const root = new Chess(game.fen());

        let bestMove: Move | null;
        let bestMoveVal = -Infinity;

        for(const move of root.moves({ verbose: true })) {
            root.move(move);
            const val = -this.negamax(root, this.depth, -Infinity, +Infinity, -1);
            if(val > bestMoveVal) {
                bestMove = move;
                bestMoveVal = val;
            }
            root.undo();
        }

        return bestMove;
    }

    private negamax(node: ChessInstance, depth: number, alpha: number, beta: number, color: number): number {
        if(depth === 0 || node.game_over()) {
            return color * this.getHeuristic(node);
        }

        let val = -Infinity;
        for(const move of node.moves()) {
            node.move(move); // Move to child node
            val = Math.max(val, -this.negamax(node, depth - 1, -beta, -alpha, -color));
            node.undo(); // Get back to parent node

            alpha = Math.max(alpha, val);
            if(alpha >= beta) {
                break;
            }
        }
        return val;
    }

    /*
    private negamax(node: ChessInstance, depth: number, color: number): number {
        if(depth === 0 || node.game_over()) {
            return color * this.getHeuristic(node);
        }

        let val = -Infinity;
        for(const move of node.moves()) {
            node.move(move); // Move to child node
            val = Math.max(val, -this.negamax(node, depth - 1, -color));
            node.undo(); // Get back to parent node
        }
        return val;
    }
    */

    private getHeuristic(game: ChessInstance): number {
        if(game.game_over()) {
            return -Infinity;
        }

        let val = 0;
        for(const square of game.SQUARES) {
            const piece = game.get(square);
            if(piece) {
                if(piece.color === game.turn()) {
                    val += this.piecesValues[piece.type];
                } else {
                    val -= this.piecesValues[piece.type];
                }
            }
        }
        return val;
    }
}
