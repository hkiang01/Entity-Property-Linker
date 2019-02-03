import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Radio from "@material-ui/core/Radio";
import DeleteIcon from "@material-ui/icons/Delete";

import * as apiConfig from "../../config/api.json";
import { Entity } from "./Entities";
import { Property } from "./Properties";

/**
 * Styles named after their respective components.
 * For example, typography is for the <Typography /> component
 */
const styles = theme => ({
  root: {
    spacing: 24,
    padding: theme.spacing.unit * 1,
    dense: true
  },
  typography: {
    paddingLeft: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2
  },
  input: {
    flex: 1
  },
  tableContainer: {
    spacing: 24,
    maxHeight: "50vh",
    overflow: "auto"
  },
  tableHead: {
    backgroundColor: "#fff",
    position: "sticky",
    top: 0
  }
});

/**
 * Mimics the link table
 */
class Link {
  constructor(id, entityId, propertyId) {
    this.id = id;
    this.entityId = entityId;
    this.propertyId = propertyId;
  }
}

/**
 * Mimics the named_link table
 */
export class NamedLink {
  constructor(id, entityId, entityName, propertyId, propertyName) {
    this.id = id;
    this.entityId = entityId;
    this.entityName = entityName;
    this.propertyId = propertyId;
    this.propertyName = propertyName;
  }
}

/**
 * The baseUrl for API requests
 */
const endpoint = apiConfig.dev.endpoint;

/**
 * Gets named_link records from the database
 */
const getNamedLinks = async () => {
  const response = await fetch(endpoint + "/named_link");
  const body = await response.json();
  console.debug("getLinks response", response);
  if (response.status !== 200) throw Error(body.message);

  const result = Promise.resolve(body);
  return result.then(function(records) {
    console.debug("getNamedLinks records", records);
    return records.map(
      record =>
        new NamedLink(
          record.id,
          record.entity_id,
          record.entity_name,
          record.property_id,
          record.property_name
        )
    );
  });
};

/**
 * Deletes link from the database
 */
const deleteLink = async link => {
  console.debug("deleteLink link", link);
  const data = JSON.stringify({ id: link.id });
  const response = await fetch(endpoint + "/link", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("deleteLink response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

class Links extends React.Component {
  /**
   * Used to store
   * - the selected NamedLink
   * - the query used to filter the list of NamedLinks
   * - the NamedLinks
   * - whether the user can click the 'Add' button
   */
  state = {
    selectedNamedLink: null,
    query: null,
    namedLinks: []
  };

  /**
   * Gets the named_link records from the database,
   * transforms them into NamedLink instances,
   * and populates the state
   *
   * Also updates the namedLinksListener of the updated named links, if defined
   */
  componentDidMount() {
    getNamedLinks().then(namedLinks => {
      console.debug("componentDidMount namedLinks", namedLinks);
      this.setState({ namedLinks: namedLinks }, () => {
        if (this.props.namedLinksListener) {
          this.props.namedLinksListener(this.state.namedLinks);
        }
        console.debug("componentDidMount state", this.state);
      });
    });
  }

  /**
   * Deletes the selected link from the database,
   * Removes the selected link from the list of namedLinks,
   * then sets the selected namedLink to null.
   *
   * Also updates the namedLinksListener of the updated named links, if defined
   */
  handleDelete = () => {
    const namedLinkToDelete = this.state.selectedNamedLink;
    const linkToDelete = new Link(
      namedLinkToDelete.id,
      namedLinkToDelete.entityId,
      namedLinkToDelete.propertyId
    );
    console.debug("handleDelete");
    console.debug("handleDelete namedLinkToDelete", namedLinkToDelete);
    console.debug("handleDelete linkToDelete", linkToDelete);

    deleteLink(linkToDelete).then(() => {
      this.setState(prevState => {
        let namedLinks = prevState.namedLinks;
        namedLinks = namedLinks.filter(
          namedLink => namedLink !== namedLinkToDelete
        );
        if (this.props.namedLinksListener) {
          this.props.namedLinksListener(namedLinks);
        }
        return { namedLinks: namedLinks, selectedNamedLink: null };
      });
    });
  };

  /**
   * Filters the list of visible links
   */
  handleSearch = event => {
    const queryValue = event.target.value;
    this.setState(
      {
        query: queryValue
      },
      () => {
        console.debug("handleSearch state", this.state);
      }
    );
  };

  /**
   * Toggles the selection of a NamedLink
   * If the NamedLink is already selected,
   */
  handleSelection = selection => {
    const selectionId = selection.currentTarget.value;
    const selectedNamedLink = this.state.namedLinks.find(
      namedLink => namedLink.id === selectionId
    );
    console.debug("handleSelection selectedNamedLink", selectedNamedLink);
    this.setState({ selectedNamedLink: selectedNamedLink }, () => {
      console.debug("handleSelection state", this.state);
    });
  };

  /**
   * Whether the selected Entity or Property references the Link.
   * This is helpful in informing the user what Entities and Properties
   * are linked to a given Link
   */
  isLinkReferencedBySelectedEntityOrProperty = namedLink => {
    const referencedBySelectedEntity = this.props.selectedEntity
      ? namedLink.entityId === this.props.selectedEntity.id
      : false;
    const referencedBySelectedProperty = this.props.selectedProperty
      ? namedLink.propertyId === this.props.selectedProperty.id
      : false;
    return referencedBySelectedEntity || referencedBySelectedProperty;
  };

  /**
   * Generates a NamedLink list item with:
   * - A radio button
   * - the relevant Entity name
   * - the relevant Property name
   * - a delete icon
   *
   * Also adds handlers which enable:
   * - Selecting an link
   * - Deleting an link
   *
   * Finally, the NamedLink is visible only if:
   * - the search box is empty, or
   * - the search box's query value is contained within either:
   *   - the NamedLink's coressponding Entity name
   *   - the NamedLink's coressponding Property name
   */
  generateLinkTableRow(namedLink) {
    return (
      <TableRow
        key={namedLink.id}
        selected={this.isLinkReferencedBySelectedEntityOrProperty(namedLink)}
      >
        <TableCell>
          <Radio
            checked={this.state.selectedNamedLink === namedLink}
            onChange={this.handleSelection}
            value={namedLink.id}
          />
        </TableCell>
        <TableCell>{namedLink.entityName}</TableCell>
        <TableCell>{namedLink.propertyName}</TableCell>
        <TableCell>
          <IconButton
            aria-label="Delete"
            onClick={this.handleDelete}
            value={namedLink.id}
            disabled={this.state.selectedNamedLink !== namedLink}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  /**
   * A "Links" component is titled with the word "Links".
   * Below that, a search bar and a button to "Add Link" is present.
   * Finally, a table is shown listing the links present in state.
   */
  render() {
    console.debug("Links props", this.props);
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Typography
          variant="h4"
          gutterBottom
          align="left"
          className={classes.typography}
        >
          Links
        </Typography>
        <Grid container className={classes.root}>
          <IconButton aria-label="Search">
            <SearchIcon />
          </IconButton>
          <InputBase
            id="link-query"
            className={classes.input}
            placeholder="Search Links"
            onChange={this.handleSearch}
          />
        </Grid>
        <Grid container className={classes.tableContainer}>
          <Table>
            <TableHead>
              {/* TODO: Fix this - currently the table head has weird behavior when scrolling (see open issue: https://github.com/mui-org/material-ui/issues/6625) */}
              <TableRow>
                <TableCell className={classes.tableHead} />
                <TableCell className={classes.tableHead}>Entity</TableCell>
                <TableCell className={classes.tableHead}>Property</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.namedLinks.map(namedLink =>
                this.generateLinkTableRow(namedLink)
              )}
            </TableBody>
          </Table>
        </Grid>
      </Paper>
    );
  }
}

Links.propTypes = {
  selectedEntity: PropTypes.instanceOf(Entity).isRequired,
  selectedProperty: PropTypes.instanceOf(Property).isRequired,
  namedLinksListener: PropTypes.func
};

export default withStyles(styles)(Links);
