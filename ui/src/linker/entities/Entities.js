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
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import * as apiConfig from '../../../config/api.json';

const endpoint = apiConfig.dev.endpoint;

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

function Entity(id, name) {
  this.id = id;
  this.name = name;
}

/**
 * Gets entries from API
 */
const getEntries = async() => {
  const response = await fetch(endpoint+'/entity');
  const body = await response.json();
  console.debug("getEntries response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
}

/**
 * Adds an entity to the database by name
 */
const addEntity = async(name) => {
  const data = JSON.stringify({name: name});
  const response = await fetch(endpoint+'/entity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data
  });
  const body = await response.json();
  console.debug("addEntry response", response);
  console.debug("addEntry body", body);
  if(response.status !== 200) throw Error(body.message);
  return body;
}

class Entities extends React.Component {
  /**
   * Used to store
   * - the selected entity
   * - the query used to filter the entities list
   * - the entities from the api
   */
  state = {
    selectedValue: null,
    query: null,
    entities: [new Entity("", "ent0")],
    enableAddButton: false,
  };

  /**
   * Gets the entiites from the database,
   */
  componentDidMount() {
    getEntries().then(res => {
      this.setState(({
        entities: res
      }), () => {
        console.debug(this.state);
      });
    })
    .catch(err => console.error(err));
  }

  /**
   * Filters the list of entities
   * Sets the condition for the add button to be enabled. It should be enabled if:
   * - 'query' is empty, or
   * - there exists no entity whose name contains the 'query'
   */
  handleSearch = event => {
    const queryValue = event.target.value
    this.setState(({
      query: queryValue,
      enableAddButton: !!(queryValue && !this.state.entities.find(entity => entity.name.includes(queryValue)))
    }), () => {
      console.debug(this.state);
    });
  };

  /**
   * Toggles the selection of an entity
   * If the selection is the same as what is selected,
   * set the selected entity to null
   */
  handleSelection = (event, checked) => {
    const selectionValue = event.target.value;
    if(this.state.selectedValue === selectionValue) {
      this.setState(({
        selectedValue: null
      }), () => {
        console.debug(this.state);
      });
    } else {
      this.setState(({
        selectedValue: event.target.value
      }), () => {
        console.debug(this.state);
      });
    }
  }

  /**
   * Adds new entity to database with name present in 'query',
   * then adds the newly created entity to the entity list.
   * Finally, clears the 'query' so the eneity list can be displayed in full.
   */
  handleAdd = event => {
    const newEntityName = document.getElementById("entity-query").value;
    addEntity(newEntityName)
    .then(response => {
      console.debug("handlAdd repsonse", response);
      this.setState((prevState, props) => {
        let entities = prevState.entities;
        entities.push(new Entity(response.id, response.name));
        return {
        query: "", entities: entities
      }});
    });
  }

  handleDeletion = event => {
    console.debug("deletion", this.state.selectedValue);
  }

 /**
   * Generates entities, each with:
   * - A checkbox
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
  generateEntities(entityObjs) {
    return entityObjs.map(entityObj => (!this.state.query || entityObj.name.includes(this.state.query)) && (
      <ListItem
        hidden={false}
        key={entityObj.id}
      >
        <Checkbox
          checked={this.state.selectedValue === entityObj.name}
          onChange={this.handleSelection}
          value={entityObj.name}
        />
        <ListItemText
          primary={entityObj.name}
        />
        <ListItemSecondaryAction>
          <IconButton
            aria-label="Delete"
            onClick={this.handleDeletion}
            value={entityObj.name}
            disabled={this.state.selectedValue !== entityObj.name}
          >
            <DeleteIcon
            />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))
  }

  /**
   * Generates a paper with:
   * - A title
   * - A search box with add button
   * - A list of entities generated by generateEntities()
   */
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
        <Grid container spacing={16}>
          <List id="entries-list" className={classes.root}>
            {this.generateEntities(this.state.entities)}
          </List>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(Entities);