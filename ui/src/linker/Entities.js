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
  },
  listContainer: {
    maxHeight: "50vh",
    overflow: "auto"
  }
});

/**
 * An Entity corresponding to the DB's `entity` table.
 * This schema is available to be imported
 */
export class Entity {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

/**
 * The baseUrl for API requests
 */
const endpoint = apiConfig.dev.endpoint;

/**
 * Gets entities from the database
 */
const getEntities = async () => {
  const response = await fetch(endpoint + "/entity");
  const body = await response.json();
  console.debug("getEntities response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Adds an entity to the database by name
 */
const addEntity = async name => {
  const data = JSON.stringify({ name: name });
  const response = await fetch(endpoint + "/entity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("addEntity response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Delets entity from the database
 */
const deleteEntity = async entity => {
  const data = JSON.stringify({ id: entity.id, name: entity.name });
  const response = await fetch(endpoint + "/entity", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("deleteEntity response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

class Entities extends React.Component {
  /**
   * Used to store
   * - the selected entity
   * - the query used to filter the entities list
   * - the entities from the api
   * - whether the user can click the 'Add' button
   */
  state = {
    selectedEntity: null,
    query: null,
    entities: [],
    enableAddButton: false
  };

  /**
   * Gets the entity records from the database,
   * transforms them into Entity instances,
   * and populates the state
   */
  componentDidMount() {
    getEntities()
      .then(res => {
        const retrievedEntities = res.map(
          record => new Entity(record.id, record.name)
        );
        this.setState({ entities: retrievedEntities }, () => {
          console.debug("componentDidMount state", this.state);
        });
      })
      .catch(err => console.error(err));
  }

  /**
   * Adds new entity to database with name present in 'query',
   * then adds the newly created entity to the entity list.
   *
   * It then disables the add button, as a user would not intend to add
   * an entity with an empty name.
   *
   * Finally, it clears the 'query' (both state and search bar value)
   * so the entity list can be displayed in full.
   */
  handleAdd = () => {
    const newEntityName = document.getElementById("entity-query").value;
    addEntity(newEntityName).then(record => {
      this.setState(
        (prevState) => {
          let entities = prevState.entities;
          entities.push(new Entity(record.id, record.name));
          return {
            query: "",
            entities: entities,
            enableAddButton: false
          };
        },
        () => {
          document.getElementById("entity-query").value = "";
        }
      );
    });
  };

  /**
   * Deletes the selected entity from the database,
   * Removes the selected entity from the list of Entities,
   * then sets the selected entity to null.
   */
  handleDelete = event => {
    const entityToDelete = this.state.selectedEntity;
    deleteEntity(entityToDelete).then(() => {
      this.setState((prevState) => {
        let entities = prevState.entities;
        entities = entities.filter(entity => entity !== entityToDelete);
        return { entities: entities, selectedEntity: null };
      });
    });
  };

  /**
   * Filters the list of visible entities
   * Sets the condition for the add button to be enabled. It should be enabled if:
   * - 'query' is empty, or
   * - there exists no entity in the list whose name equals the 'query'
   */
  handleSearch = event => {
    const queryValue = event.target.value;
    this.setState(
      {
        query: queryValue,
        enableAddButton: !!(
          queryValue &&
          !this.state.entities.find(entity => entity.name === queryValue)
        )
      },
      () => {
        console.debug("handleSearch state", this.state);
      }
    );
  };

  /**
   * Toggles the selection of an entity
   * Also notifies the selectedEntityListener, if defined, of the newly-selected Entity
   */
  handleSelection = selection => {
    const selectionId = selection.currentTarget.value;
    const selectedEntity = this.state.entities.find(
      entity => entity.id === selectionId
    );

    this.setState({ selectedEntity: selectedEntity }, () => {
      if (this.props.selectedEntityListener) {
        this.props.selectedEntityListener(selectedEntity);
      }
      console.debug("handleSelection state", this.state);
    });
  };

  /**
   * Generates a property list item with:
   * - A radio button
   * - Some text
   * - A delete icon
   *
   * Also adds handlers which enable:
   * - Selecting an entity
   * - Deleting an entity
   *
   * Finally, the entity is visible only if:
   * - the search box is empty, or
   * - the search box's query value is contained within the entity's name
   */
  generateEntityListItem(entity) {
    return (
      <ListItem
        hidden={!this.state.query || entity.name.includes(this.state.query)}
        key={entity.id}
      >
        <Radio
          checked={this.state.selectedEntity === entity}
          onChange={this.handleSelection}
          value={entity.id}
        />
        <ListItemText primary={entity.name} />
        <ListItemSecondaryAction>
          <IconButton
            aria-label="Delete"
            onClick={this.handleDelete}
            value={entity.name}
            disabled={this.state.selectedEntity !== entity}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  /**
   * A "Entities" component is titled with the word "Entities".
   * Below that, a search bar and a button to "Add" a new Entity is present.
   * Finally, a table is shown listing the entities present in state.
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
          Entities
        </Typography>
        <Grid container spacing={16}>
          <IconButton aria-label="Search">
            <SearchIcon />
          </IconButton>
          <InputBase
            id="entity-query"
            className={classes.input}
            placeholder="Search Entities"
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
        <Grid container spacing={16} className={classes.listContainer}>
          <List id="entities-list" className={classes.root}>
            {this.state.entities.map(entity =>
              this.generateEntityListItem(entity)
            )}
          </List>
        </Grid>
      </Paper>
    );
  }
}

Entities.propTypes = {
  selectedEntityListener: PropTypes.func
};

export default withStyles(styles)(Entities);
