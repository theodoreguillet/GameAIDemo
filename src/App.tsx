import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from '@/components/About';
// Pages
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { ChessGame } from '@/components/Chess';
import { TicTacToe } from '@/components/TicTacToe';
import '@/App.css';

const AppImpl = () => (
  <BrowserRouter>
    <div>
      <Grid container spacing={5}>
        <Header />
        <Switch>
          <Route path='/chess' component={ChessGame} />
          <Route path='/tictactoe' component={TicTacToe} />
          <Route path='/about' component={About} />
          <Route path='/' component={Home} />
        </Switch>
      </Grid>
    </div>
  </BrowserRouter>
);

export const App = hot(module)(AppImpl);
