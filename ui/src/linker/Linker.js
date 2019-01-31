import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Entities from './entities/Entities';
import Properties from './properties/Properties';
import Links from './links/Links';

const styles = theme => ({
  root: {
    margin: 10,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  }
});

function Linker (props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs>
          <Entities />
        </Grid>
        <Grid item xs>
          <Properties />
        </Grid>
      </Grid>
      <Grid container spacing={24}>
        <Grid item xs>
          <Links />
        </Grid>
      </Grid>
    </div>
  );
}
export default withStyles(styles)(Linker);