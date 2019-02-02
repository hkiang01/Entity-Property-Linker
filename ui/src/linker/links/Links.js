import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import Radio from "@material-ui/core/Radio";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";

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

function Link(entity_id, property_id) {
  this.entity_id = entity_id;
  this.property_id = property_id;
}

class Links extends React.Component {
  /**
   * Used to store
   * - the selected Link
   * - the query used to filter the list of Links
   * - the Links from the API
   * - whether the user can click the 'Add' button
   */
  state = {
    selectedLInk: null,
    query: null,
    links: [],
    enableAddButton: false
  };

  /**
   * Generates link, each with:
   * - A radio button
   * - text for the corresponding entity
   * - a divider
   * - text for the corresponding property
   * - A delete icon
   *
   * Also adds handlers which enable:
   * - Selecting a link
   * - Deleting a link
   *
   * Finally, the link is visible only if:
   * - the search box is empty, or
   * - the search box's query value is contained within
   *   either the corresponding entity or property
   */
  generateLinks(linkObjs) {
    return linkObjs.map(
      linkObj =>
        (!this.state.query ||
          linkObj.entity.name.includes(this.state.query) ||
          linkObj.property.name.includes(this.state.query)) && (
          <ListItem
            hidden={false}
            key={linkObj.entity.id + linkObj.property.id}
          >
            <Radio
              checked={this.state.selectedLink === linkObj}
              onChange={this.handleSelection}
              value={linkObj.entity.id + linkObj.property.id}
            />
            <ListItemText
              primary={linkObj.entity.name + linkObj.property.name}
            />
            <ListItemSecondaryAction>
              <IconButton
                aria-label="Delete"
                onClick={this.handleDelete}
                value={linkObj.entity.id + linkObj.property.id}
                disabled={this.state.selectedLink !== linkObj}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )
    );
  }

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
          Links
        </Typography>
        <Grid container spacing={16}>
          <IconButton aria-label="Search">
            <SearchIcon />
          </IconButton>
          <InputBase
            id="entity-query"
            className={classes.input}
            placeholder="Search Links"
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
      </Paper>
    );
  }
}

export default withStyles(styles)(Links);
