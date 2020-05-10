import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import css from './styles.css';

export class About extends React.Component {
  public render() {
    return (
      <div className={css.container}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Created by Théodore Guillet' />
            <CardContent>
              <Typography variant='subheading'>
                You can find information at <a href='https://github.com/watchtux/GameAIDemo'>github</a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </div>
    );
  }
}
