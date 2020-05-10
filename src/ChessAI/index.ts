import { ChessInstance, ShortMove } from 'chess.js';

export default class ChessAI {
    constructor() {
        //
    }

    public getBestMove(game: ChessInstance): ShortMove | null {
        return game.moves({  verbose: true })[0] || null;
    }
}
