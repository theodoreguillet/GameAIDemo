import * as React from 'react';
import Chessboard from 'chessboardjsx';
import Negamax from '@/ChessAI/Negamax';
// import rough from 'roughjs/dist/rough.umd';
import rough from 'roughjs/bundled/rough.esm.js';
import { ChessInstance } from 'chess.js';
const Chess = require('chess.js');
import css from '@/components/Board/styles.css';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

export class Board extends React.Component {
  public state = {
    possibleMoves: [] as string[],
    selectedSquare: '',
    position: 'start',
    history: [] as any[],
    aiLevel: 1,
    playerColor: 'w'
  };

  private game: ChessInstance | undefined;

  private ai = new Negamax(1);

  public componentDidMount() {
    this.game = new Chess();
  }

  public render() {

    const squareStyles = this.state.possibleMoves.reduce((styles, square) => ({
      ...styles,
      [square]: {
        background: 'radial-gradient(circle, #5b5b5b5b 25%, transparent 20%)',
        borderRadius: '50%'
      }
    }), {});

    return (
      <div className={css.container}>
        <div className={css.board}>
          <Chessboard
            id='standard'
            orientation={this.state.playerColor === 'b' ? 'black' : 'white'}
            width={800}
            roughSquare={this.roughSquare}
            position={this.state.position}
            dropOffBoard='trash'
            sparePieces={false}
            // lightSquareStyle={{ backgroundColor: 'AliceBlue' }}
            // darkSquareStyle={{ backgroundColor: 'CornFlowerBlue' }}
            lightSquareStyle={{ backgroundColor: '#eeeed2' }}
            darkSquareStyle={{ backgroundColor: '#769656' }}
            squareStyles={squareStyles}
            onDrop={this.onDrop}
            onSquareClick={this.onSquareClick}
          />
        </div>
        <div className={css.panel}>
          {/*<Typography variant='h5' style={{ margin: 20 }}>
            Options
          </Typography>*/}
          {/*<FormControl style={{ margin: 10 }}>
            <InputLabel id='aiLevelLbl'>Level</InputLabel>
            <Select
              labelId='aiLevelLbl'
              id='aiLevel'
              value={this.state.aiLevel}
              onChange={this.handleAiLevelChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>*/}
          <FormControl style={{ margin: 10 }}>
            <InputLabel id='playerColorLbl'>Play</InputLabel>
            <Select
              labelId='playerColorLbl'
              id='playerColor'
              value={this.state.playerColor}
              onChange={this.handlePlayerColorChange}
            >
              <MenuItem value={'w'}>White</MenuItem>
              <MenuItem value={'b'}>Black</MenuItem>
            </Select>
          </FormControl>
          {/*<Button onClick={this.handleReplayClicked}>Replay</Button>*/}
        </div>
      </div>
    );
  }

  private handleAiLevelChange = (event: any) => {
    this.setState({
      aiLevel: event.target.value
    });
  }

  private handlePlayerColorChange = (event: any) => {
    /*
    this.setState({
      playerColor: event.target.value
    });
    */
    this.game = new Chess();

    this.setState({
      position: this.game.fen(),
      history: this.game.history({ verbose: true }),
      possibleMoves: [],
      selectedSquare: '',
      playerColor: event.target.value
    });

    if(event.target.value === 'b') {
      setTimeout(this.aiMove, 100);
    }
  }

  private handleReplayClicked = () => {
    this.game.reset();

    this.setState({
      position: this.game.fen(),
      history: this.game.history({ verbose: true }),
      possibleMoves: [],
      selectedSquare: ''
    });

    if(this.state.playerColor === 'b') {
      setTimeout(this.aiMove, 100);
    }
  }

  private aiMove = () => {
    // First move
    const move = this.ai.getBestMove(this.game);
    console.log('AI MOVE', move);
    this.move(move.from, move.to, move.promotion);
  }

  private roughSquare = ({ squareElement, squareWidth }: any) => {
    const rc = rough.svg(squareElement);
    const chessSquare = rc.rectangle(0, 0, squareWidth, squareWidth, {
      roughness: 0.2,
      fill: 'AliceBlue',
      bowing: 2,
      fillStyle: 'cross-hatch'
    });
    // squareElement.appendChild(chessSquare);
  }

  private onDrop = (drop: { sourceSquare: string; targetSquare: string; piece: string }) => {
    if(this.move(drop.sourceSquare, drop.targetSquare)) {
      setTimeout(this.aiMove, 100);
    }
  }

  private onSquareClick = (square: string) => {
    if (this.state.selectedSquare !== '' && this.state.possibleMoves.includes(square)) {
      if(this.move(this.state.selectedSquare, square)) {
        setTimeout(this.aiMove, 100);
      }
    } else {
      const moves = this.game.moves({
        square,
        verbose: true
      });
      const possibleMoves = moves.map(m => m.to);

      this.setState({
        possibleMoves,
        selectedSquare: square
      });
    }
  }

  private move(sourceSquare: string, targetSquare: string, promotion: string = 'q') {
    const move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion
    } as any);

    console.log(this.game.fen());

    this.setState({
      position: this.game.fen(),
      history: this.game.history({ verbose: true }),
      possibleMoves: [],
      selectedSquare: ''
    });
    return move;
  }
}