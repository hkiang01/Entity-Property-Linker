import React, { Component } from 'react';
import './App.css';
import Linker from './linker/Linker.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">Entity-Property Linker</div>
        <Linker />
      </div>
    );
  }
}

export default App;
