import * as React from 'react';
import Sketch from 'react-p5';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import css from '@/components/TicTacToe/styles.css';

export class TicTacToe extends React.Component {
  public board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  public ai = 'X';
  public human = 'O';
  public currentPlayer = this.ai;

  public scores = {
    X: 10,
    O: -10,
    tie: 0
  };

  public w = 200;
  public h = 200;

  public minimax(board: any, depth: any, isMaximizing: any) {
    const result = this.checkWinner();
    if (result !== null) {
      return (this.scores as any)[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (this.board[i][j] === '') {
            this.board[i][j] = this.ai;
            const score = this.minimax(board, depth + 1, false);
            this.board[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (this.board[i][j] === '') {
            this.board[i][j] = this.human;
            const score = this.minimax(board, depth + 1, true);
            board[i][j] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }

  public bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (this.board[i][j] === '') {
          this.board[i][j] = this.ai;
          const score = this.minimax(this.board, 0, false);
          this.board[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    this.board[move.i][move.j] = this.ai;
    this.currentPlayer = this.human;
  }

  public setup = (p5: any, parent: any) => {
    p5.createCanvas(600, 600).parent(parent);
    this.w = p5.width / 3;
    this.h = p5.height / 3;

    if(this.currentPlayer === this.ai){
      this.bestMove();
    }
  }

  public equals3(a: any, b: any, c: any) {
    return a === b && b === c && a !== '';
  }

  public checkWinner() {
    let winner = null;

    // horizontal
    for (let i = 0; i < 3; i++) {
      if (this.equals3(this.board[i][0], this.board[i][1], this.board[i][2])) {
        winner = this.board[i][0];
      }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
      if (this.equals3(this.board[0][i], this.board[1][i], this.board[2][i])) {
        winner = this.board[0][i];
      }
    }

    // Diagonal
    if (this.equals3(this.board[0][0], this.board[1][1], this.board[2][2])) {
      winner = this.board[0][0];
    }
    if (this.equals3(this.board[2][0], this.board[1][1], this.board[0][2])) {
      winner = this.board[2][0];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === '') {
          openSpots++;
        }
      }
    }

    if (winner == null && openSpots === 0) {
      return 'tie';
    } else {
      return winner;
    }
  }

  public draw = (p5: any) => {
    p5.background(255);
    p5.strokeWeight(4);
    p5.line(this.w, 0, this.w, p5.height);
    p5.line(this.w * 2, 0, this.w * 2, p5.height);
    p5.line(0, this.h, p5.width, this.h);
    p5.line(0, this.h * 2, p5.width, this.h * 2);

    if (p5.mouseIsPressed && this.currentPlayer === this.human) {
      const i = Math.floor(p5.mouseX / this.w);
      const j = Math.floor(p5.mouseY / this.h);
      // If valid turn
      if (this.board[i][j] === '') {
        this.board[i][j] = this.human;
        this.currentPlayer = this.ai;

        if(this.checkWinner() == null){
          this.bestMove();
        }
      }
    }

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        const x = this.w * i + this.w / 2;
        const y = this.h * j + this.h / 2;
        const spot = this.board[i][j];
        p5.textSize(32);
        const r = this.w / 4;
        if (spot === this.human) {
          p5.noFill();
          p5.ellipse(x, y, r * 2);
        } else if (spot === this.ai) {
          p5.line(x - r, y - r, x + r, y + r);
          p5.line(x + r, y - r, x - r, y + r);
        }
      }
    }

    const result = this.checkWinner();
    if (result != null) {
      p5.noLoop();
      const resultP = p5.createP(''); // Creates a <p></p> element in the DOM with given inner HTML. Used for paragraph length text.
      resultP.style('font-size', '32pt');
      resultP.style('margin-left', '40%');
      resultP.style('margin-right', '52%');
      resultP.style('background-color', 'rgb(255,255,255)');
      if (result === 'tie') {
        resultP.html('Tie!');
      } else {
        resultP.html(`${result} wins!`);
      }
    }
  }

  public render() {
    return <div className={css.container}><Sketch setup={this.setup} draw={this.draw} /></div>;
  }
}