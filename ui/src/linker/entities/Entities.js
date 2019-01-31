import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  root: {
    width: '100%',
    padding: theme.spacing.unit * 2
  },
  typography: {
    marginLeft: 10,
    marginBottom: 20
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  }
});

class Entities extends React.Component {
  state = {
    dense: false
  };

  handleSearch = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSelection = selection => {
    console.log("selection", selection);
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Typography className={classes.typography} variant='h4' gutterBottom align="left">
          Entities
        </Typography>
        <Grid container spacing={16}>
          <IconButton aria-label="Search">
            <SearchIcon />
          </IconButton>
          <InputBase className={classes.input}
            placeholder="Search Entities"
            onChange={this.handleSearch('query')}
          />
          <Button variant="contained" color="secondary" disabled className={classes.button}>
            Add
          </Button>
        </Grid>
        <Grid container spacing={16}>
          <List className={classes.root}>
            <ListItem>
              <Radio />
              <ListItemText
                primary="Sample entity"
              />
              <ListItemSecondaryAction>
                <IconButton aria-label="Delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(Entities);