import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Entities from "./entities/Entities";
import Properties from "./properties/Properties";
import Links from "./links/Links";

const styles = theme => ({
  root: {
    margin: 10,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
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
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs>
            <Entities selectedEntityListener={this.selectedEntityListener} />
          </Grid>
          <Grid item xs>
            <Properties
              selectedPropertyListener={this.selectedPropertyListener}
            />
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs>
            <Links
              selectedEntity={this.state.selectedEntity}
              selectedProperty={this.state.selectedProperty}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(Linker);
