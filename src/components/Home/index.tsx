import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import css from './styles.css';
import chessImg from '@assets/chess.jpg';

export class Home extends React.Component {
  public render() {
    return (
      <div className={css.container}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Chess Game' />
            <CardContent>
              <img src={chessImg} className={css.chessImg} />
              <Typography variant='body1'>
                This is project is demonstration of chess and tic tac toe ai made with React & TypeScript. <br/>
                Using the Minmax and Negamax algorithms with alpha beta to find the best solution in the game tree.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </div>
    );
  }
}
