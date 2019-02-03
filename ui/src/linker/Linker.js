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
import { NamedLink } from "./Links";
import * as apiConfig from "../../config/api.json";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2
  },
  gridItem: {
    flexGrow: 1
  }
});

/**
 * The baseUrl for API requests
 */
const endpoint = apiConfig.dev.endpoint;

/**
 * Adds aa link to the database by entityId and propertyId
 */
const addLink = async (entityId, propertyId) => {
  const data = JSON.stringify({ entityId: entityId, propertyId: propertyId });
  const response = await fetch(endpoint + "/link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("addLink response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

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

  /**
   * A new NamedLink can be added if there exists no NamedLink
   * in namedLinks whose entityId and propertyId match the
   * selectedEntity's id and selectedProperty's id, respectively
   */
  canAddNewLink() {
    const selectedEntity = this.state.selectedEntity;
    const selectedProperty = this.state.selectedProperty;
    console.debug("selectedEntity", selectedEntity);
    console.debug("selectedProperty", selectedProperty);
    console.debug("namedLinks", this.state.namedLinks);
    const result =
      selectedEntity &&
      selectedEntity.id &&
      selectedProperty &&
      selectedProperty.id &&
      !this.state.namedLinks.find(
        namedLink =>
          namedLink.entityId &&
          namedLink.entityId === selectedEntity.id &&
          namedLink.propertyId &&
          namedLink.propertyId === selectedProperty.id
      );
    console.debug("canAddNewLink result", result);
    return result;
  }

  /**
   * Adds new link to database based on the selected entity and property.
   * Note that the view from which getNamedLinks() pulls from won't be updated yet.
   * To compensate, this method creates a new NamedLink based on the information that would appear in the named_link view once updated
   * This way, the user doesn't have to refresh the page in order to see the newly-added link in the "Links" list
   *
   * Also updates the namedLinksListener of the updated named links, if defined
   */
  handleAdd = () => {
    addLink(this.state.selectedEntity.id, this.state.selectedProperty.id).then(
      newLink =>
        this.setState(
          prevState => {
            let namedLinks = prevState.namedLinks;
            const newNamedLink = new NamedLink(
              newLink.id,
              this.state.selectedEntity.id,
              this.state.selectedEntity.name,
              this.state.selectedProperty.id,
              this.state.selectedProperty.name
            );
            namedLinks.push(newNamedLink);
            return { namedLinks: namedLinks };
          },
          () => {
            console.debug("handleAdd state", this.state);
          }
        )
    );
  };

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
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!this.canAddNewLink()}
                    onClick={this.handleAdd}
                  >
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
