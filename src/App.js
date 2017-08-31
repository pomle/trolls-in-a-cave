import React, { Component } from 'react';
import Presenter from '@snakesilk/react-presenter';
import {createGame} from './game';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    window.game = this.game = createGame();
  }

  render() {
    return (
      <Presenter
        game={this.game}
        fillWindow
      >
        <h1>Trolls in a Cave</h1>
      </Presenter>
    );
  }
}

export default App;
