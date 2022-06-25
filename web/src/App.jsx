import React from 'react';
const fetch = require('node-fetch');

import './App.css';

class App extends React.Component { // Create App class
  constructor (props) {
    super(props);

    this.state = { // Create state for App
      repos: [], // Placeholder for loading in repos data
      dataIsLoaded: false // Flag whether the data has been loaded
    }
  }

  componentDidMount() { // When component mounts, read data from repos API running on localhost:4000
    fetch ('http://localhost:4000/repos')
      .then((res) => res.json())
      .then((json) => {
        this.setState({ // Update the state to reflect that the data has been loaded
          repos: json,
          dataIsLoaded: true
        });
      });
  }

  render() {
    if (this.state.dataIsLoaded) { // If the data has been loaded, display the data
      return (
        // Display the data
      )
    }
    else { // If data has not been loaded, display loading message
      return (
        <div>Loading ...</div> // Display loading message
      );
    }
  }
}

export default App;
