import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Entities from './entities/Entities'
import Properties from './properties/Properties'

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
});

function Linker (props) {
  const { classes } = props;
  return (
    <div>
      <Grid container spacing={24}>
        <Grid item xs>
          <Paper className={classes.paper}>Entities</Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}>Properties</Paper>
        </Grid>
      </Grid>
      <Grid container spacing={24}>
        <Grid item xs>
          <Paper className={classes.paper}>Links</Paper>
        </Grid>
      </Grid>
    </div>
  );
}
export default withStyles(styles)(Linker);