import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import Entities from "./Entities";
import Properties from "./Properties";
import Links from "./Links";
import { Entity } from "./Entities";
import { Property } from "./Properties";

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
    this.namedLinksListener = this.namedLinksListener.bind(this);
  }

  state = {
    selectedEntity: new Entity(),
    selectedProperty: new Property(),
    namedLinks: [],
    selectedLink: null
  };

  /**
   * Makes the Linker aware of the selected entity
   */
  selectedEntityListener(selectedEntity) {
    this.setState({ selectedEntity: selectedEntity }, () => {
      console.debug("selectedEntityListener state", this.state);
    });
  }

  /**
   * Makes the Linker aware of the selected property
   */
  selectedPropertyListener(selectedProperty) {
    this.setState({ selectedProperty: selectedProperty }, () => {
      console.debug("selectedPropertyListener state", this.state);
    });
  }

  /**
   * Makes the Linker aware of the named links
   */
  namedLinksListener(namedLinks) {
    console.debug("namedLinksListener namedLinks", namedLinks);
    this.setState({ namedLinks: namedLinks }, () => {
      console.debug("namedLinksListener state", this.state);
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
              namedLinksListener={this.namedLinksListener}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(Linker);
