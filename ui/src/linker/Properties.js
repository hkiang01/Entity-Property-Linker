import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Radio from "@material-ui/core/Radio";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import * as apiConfig from "../../config/api.json";

/**
 * Styles named after their respective components.
 * For example, typography is for the <Typography /> component
 */
const styles = theme => ({
  root: {
    width: "100%",
    padding: theme.spacing.unit * 1,
    dense: true,
    spacing: 24
  },
  typography: {
    paddingLeft: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2
  },
  paper: {
    padding: theme.spacing.unit * 1
  },
  input: {
    flex: 1
  },
  listContainer: {
    padding: theme.spacing.unit * 1,
    dense: true,
    spacing: 24,
    maxHeight: "35vh",
    overflow: "auto"
  }
});

/**
 * The baseUrl for API requests
 */
const endpoint = apiConfig.dev.endpoint;

/**
 * An Property corresponding to the DB's `Property` table
 * This is available to be imported
 */
export class Property {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

/**
 * Gets properties from the database
 */
const getProperties = async () => {
  const response = await fetch(endpoint + "/property");
  const body = await response.json();
  console.debug("getProperties response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Adds a Property to the database
 */
const addProperty = async name => {
  const data = JSON.stringify({ name: name });
  const response = await fetch(endpoint + "/property", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("addProperty response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Deletes Properties from the database
 */
const deleteProperty = async property => {
  const data = JSON.stringify({ id: property.id, name: property.name });
  const response = await fetch(endpoint + "/property", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("deleteProperty response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

class Properties extends React.Component {
  /**
   * Used to store
   * - the selected Property
   * - the query used to filter the properties list
   * - the properties from the api
   */
  state = {
    selectedProperty: null,
    query: null,
    properties: [],
    enableAddButton: false
  };

  /**
   * Gets the property records from the database,
   * transforms them into Property instances,
   * and populates the state
   */
  componentDidMount() {
    getProperties()
      .then(res => {
        const retrievedProperties = res.map(
          record => new Property(record.id, record.name)
        );
        this.setState({ properties: retrievedProperties }, () => {
          console.debug("componentDidMount state", this.state);
        });
      })
      .catch(err => console.error(err));
  }

  /**
   * Adds new Property to database with name present in 'query',
   * then adds the newly created Property to the Property list.
   *
   * It then disables the add button, as a user would not intend to add
   * an Property with an empty name.
   *
   * Finally, it clears the 'query' (both state and search bar value)
   * so the Property list can be displayed in full.
   */
  handleAdd = event => {
    const newPropertyName = document.getElementById("property-query").value;
    addProperty(newPropertyName).then(response => {
      this.setState(
        prevState => {
          let properties = prevState.properties;
          properties.push(new Property(response.id, response.name));
          return {
            query: "",
            properties: properties,
            enableAddButton: false
          };
        },
        () => {
          document.getElementById("property-query").value = "";
        }
      );
    });
  };

  /**
   * Deletes the selected Property from the database,
   * Removes the selected Property from the list of properties,
   * then sets the selected Property to null.
   */
  handleDelete = () => {
    const propertyToDelete = this.state.selectedProperty;
    deleteProperty(propertyToDelete).then(response => {
      this.setState(prevState => {
        let properties = prevState.properties;
        properties = properties.filter(
          property => property !== propertyToDelete
        );
        return { properties: properties };
      });
    });
  };

  /**
   * Filters the list of properties
   * Sets the condition for the add button to be enabled. It should be enabled if:
   * - 'query' is empty, or
   * - there exists no Property in the list whose name equals the 'query'
   */
  handleSearch = event => {
    const queryValue = event.target.value;
    this.setState(
      {
        query: queryValue,
        enableAddButton: !!(
          queryValue &&
          !this.state.properties.find(property => property.name === queryValue)
        )
      },
      () => {
        console.debug("handleSearch state", this.state);
      }
    );
  };

  /**
   * Toggles the selection of a Property
   * Also notifies the selectedPropertyListener, if defined, of the newly-selected Property
   */
  handleSelection = selection => {
    const selectionId = selection.currentTarget.value;
    const selectedProperty = this.state.properties.find(
      property => property.id === selectionId
    );

    this.setState({ selectedProperty: selectedProperty }, () => {
      if (this.props.selectedPropertyListener) {
        this.props.selectedPropertyListener(selectedProperty);
      }
      console.debug("handleSelection state", this.state);
    });
  };

  /**
   * Generates a Property list item with:
   * - A radio button
   * - Some text
   * - A delete icon
   *
   * Also adds handlers which enable:
   * - Selecting an Property
   * - Deleting an Property
   *
   * Finally, the property is disabled only if:
   * - it's not selected property and...
   *   - the search box's query value is not contained within the property's name
   */
  generatePropertyListItem(property) {
    return (
      <ListItem
        disabled={
          !!(
            this.state.selectedProperty !== property &&
            this.state.query &&
            !property.name.includes(this.state.query)
          )
        }
        key={property.id}
      >
        <Radio
          checked={this.state.selectedProperty === property}
          onChange={this.handleSelection}
          value={property.id}
        />
        <ListItemText primary={property.name} />
        <ListItemSecondaryAction>
          <IconButton
            aria-label="Delete"
            onClick={this.handleDelete}
            value={property.name}
            disabled={this.state.selectedProperty !== property}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  /**
   * A "Properties" component is titled with the word "Properties".
   * Below that, a search bar and a button to "Add" a new Property is present.
   * Finally, a table is shown listing the properties present in state.
   */
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Typography
          variant="h4"
          gutterBottom
          align="left"
          className={classes.typography}
        >
          Properties
        </Typography>
        <Grid container className={classes.root}>
          <IconButton aria-label="Search">
            <SearchIcon />
          </IconButton>
          <InputBase
            id="property-query"
            className={classes.input}
            placeholder="Search Properties"
            onChange={this.handleSearch}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!this.state.enableAddButton}
            onClick={this.handleAdd}
          >
            Add
          </Button>
        </Grid>
        <Grid container className={classes.listContainer}>
          <List id="properties-list" className={classes.root}>
            {this.state.properties.map(entity =>
              this.generatePropertyListItem(entity)
            )}
          </List>
        </Grid>
      </Paper>
    );
  }
}

Properties.propTypes = {
  selectedPropertyListener: PropTypes.func
};

export default withStyles(styles)(Properties);
