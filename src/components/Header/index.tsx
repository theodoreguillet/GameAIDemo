import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';

export class Header extends React.Component {
  public render() {
    return (
      <AppBar position='static' color='default'>
        <Toolbar>
          <Button color='primary' component={(p: any) => <Link to='/' {...p} />}>
            Home
          </Button>
          <Button
            color='primary'
            component={p => <Link to='/chess' {...p} />}
          >
            Chess
          </Button>
          <Button
            color='primary'
            component={p => <Link to='/tictactoe' {...p} />}
          >
            TicTacToe
          </Button>
          <Button
            color='primary'
            component={p => <Link to='/about' {...p} />}
          >
            About
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}
