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
import * as apiConfig from "../../../config/api.json";

/**
 * Styles named after their respective components.
 * For example, typography is for the <Typography /> component
 */
const styles = theme => ({
  root: {
    width: "100%",
    padding: theme.spacing.unit * 2,
    dense: true
  },
  typography: {
    marginLeft: 10,
    marginBottom: 20
  },
  paper: {
    padding: theme.spacing.unit * 2
  },
  input: {
    marginLeft: 8,
    flex: 1
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
        (prevState, props) => {
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
  handleDelete = event => {
    const propertyToDelete = this.state.selectedProperty;
    deleteProperty(propertyToDelete).then(response => {
      this.setState((prevState, props) => {
        let properties = prevState.properties;
        properties = properties.filter(
          property => property !== propertyToDelete
        );
        return { properties: properties };
      });
    });
  };

  /**
   * Gets the entiites from the database,
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
   * If the Property is already selected, clear it,
   * otherwise, check it.
   *
   * Also notifies the selectedPropertyListener, if defined, of the newly-selected Property
   */
  handleSelection = selection => {
    const selectionId = selection.currentTarget.value;
    const alreadySelected =
      this.state.selectedProperty &&
      this.state.selectedProperty.id === selectionId;

    const updatedSelection = alreadySelected
      ? null
      : this.state.properties.filter(
          property => property.id === selectionId
        )[0];

    this.setState({ selectedProperty: updatedSelection }, () => {
      if (this.props.selectedPropertyListener) {
        this.props.selectedPropertyListener(updatedSelection);
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
   * Finally, the Property is visible only if:
   * - the search box is empty, or
   * - the search box's query value is contained within the Property's name
   */
  generatePropertyListItem(propertyObj) {
    return (
      <ListItem
        hidden={
          !this.state.query || propertyObj.name.includes(this.state.query)
        }
        key={propertyObj.id}
      >
        <Radio
          checked={this.state.selectedProperty === propertyObj}
          onChange={this.handleSelection}
          value={propertyObj.id}
        />
        <ListItemText primary={propertyObj.name} />
        <ListItemSecondaryAction>
          <IconButton
            aria-label="Delete"
            onClick={this.handleDelete}
            value={propertyObj.name}
            disabled={this.state.selectedProperty !== propertyObj}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  /**
   * Generates a paper with:
   * - A title
   * - A search box with add button
   * - A list of properties generated by generateProperties()
   */
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Typography
          className={classes.typography}
          variant="h4"
          gutterBottom
          align="left"
        >
          Properties
        </Typography>
        <Grid container spacing={16}>
          <IconButton aria-label="Search">
            <SearchIcon />
          </IconButton>
          <InputBase
            id="property-query"
            className={classes.input}
            placeholder="Search properties"
            onChange={this.handleSearch}
          />
          <Button
            variant="contained"
            color="secondary"
            disabled={!this.state.enableAddButton}
            onClick={this.handleAdd}
          >
            Add
          </Button>
        </Grid>
        <Grid container spacing={16}>
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
