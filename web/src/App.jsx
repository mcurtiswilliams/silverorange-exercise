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
        <div class="Repos-table">
          <div class="Repos-table-row">
            <div class="header cell">Name</div>
            <div class="header cell">Description</div>
            <div class="header cell">Language</div>
            <div class="header cell">Forks Count</div>
          </div>
          {
            this.state.repos.map((repo, i) => {
              let rowColor = '';
              if ((i % 2) == 1) {
                rowColor = "cell Odd";
              }
              else {
                rowColor = "cell Even";
              }
              return (
                <div class="Repos-table-row">
                  <div class={rowColor}>{repo.name}</div>
                  <div class={rowColor}>{repo.description}</div>
                  <div class={rowColor}>{repo.language}</div>
                  <div class={rowColor}>{repo.forks_count}</div>
                </div>
              );
            })
          }
        </div>
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
