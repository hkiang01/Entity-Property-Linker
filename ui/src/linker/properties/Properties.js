import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';

class Properties extends Component {
  state = {
    selectedValue: ""
  };

  handleSelection = event => {
    this.setState({selectedValue: event.target.value});
  };

  render() {
    return (
      <List>
        <ListItem button>
          <ListItemIcon>
            <Radio
              checked={this.state.selectedValue === "a"}
              onChange={this.handleSelection}
              value="a"
              name="property"
            />
          </ListItemIcon>
          <ListItemText inset primary="Property 0" />
        </ListItem>
      </List>
    );
  }
}

export default Properties;
