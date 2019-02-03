import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Entities from "./Entities";
import Properties from "./Properties";
import Button from "@material-ui/core/Button";
import Links from "./Links";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2
  },
  gridItem: {
    flexGrow: 1
  }
});

class Linker extends React.Component {
  constructor() {
    super();
    this.selectedEntityListener = this.selectedEntityListener.bind(this);
    this.selectedPropertyListener = this.selectedPropertyListener.bind(this);
  }

  state = {
    selectedEntity: null,
    selectedProperty: null,
    selectedLink: null
  };

  /**
   * Makes the Linker aware of the selected entity
   */
  selectedEntityListener(selectedEntity) {
    this.setState({ selectedEntity: selectedEntity }, () => {
      console.debug("selectedEntityListener", this.state);
    });
  }

  /**
   * Makes the Linker aware of the selected property
   */
  selectedPropertyListener(selectedProperty) {
    this.setState({ selectedProperty: selectedProperty }, () => {
      console.debug("selectedPropertyListener", this.state);
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={32} className={classes.root}>
        <Grid container spacing={32} className={classes.root}>
          <Grid item className={classes.gridItem}>
            <Paper>
              <Grid container spacing={32} className={classes.root}>
                <Grid item className={classes.gridItem}>
                  <Entities
                    selectedEntityListener={this.selectedEntityListener}
                  />
                </Grid>
                <Grid item className={classes.gridItem}>
                  <Properties
                    selectedPropertyListener={this.selectedPropertyListener}
                  />
                </Grid>
                <Grid />
              </Grid>
              <Grid container spacing={32} className={classes.root}>
                <Grid item className={classes.gridItem}>
                  <Button variant="contained" color="primary">
                    Create Link
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={32} className={classes.root}>
          <Grid item className={classes.gridItem}>
            <Links
              selectedEntity={this.state.selectedEntity}
              selectedProperty={this.state.selectedProperty}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(Linker);
