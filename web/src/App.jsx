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
        json.sort(function (a, b) { // Sort json by reverse chronological order
          if (a.created_at < b.created_at) {
            return 1;
          }
          else {
            return -1;
          }
        });
        let languages = []; // Temporary variable to hold lanuages found in the list of repos
        json.map (repo => { // Add language to the list if it is not there already
          let foundRepoLanguage = false;
          languages.map (language => {
            if (repo.language == language) {
              foundRepoLanguage = true;
            }
          });
          if (!foundRepoLanguage) {
            languages.push(repo.language);
          }
        });
        this.setState({ // Update the state to reflect that the data has been loaded
          repos: json,
          dataIsLoaded: true,
          languages: languages,
          languageFilter: null

        });
      });
  }

  toggleFilter (language) {
    if (language == this.state.languageFilter) {
      this.setState ({
        languageFilter: null // Toggle the language filtering if the selected button is the existing languageFilter
      });
    }
    else {
      this.setState ({
        languageFilter: language // Set the languageFilter in the state if no filterLanguage is present
      });
    }
  }
  render() {
    if (this.state.dataIsLoaded) { // If the data has been loaded, display the data
      return (
        <div className="Repos-table">
          <div className="Repos-table-row">
            <div className="header cell">Name</div>
            <div className="header cell">Description</div>
            <div className="header cell">Language
            {
              this.state.languages.map(language => { // Create buttons for each language
                let divClass = "languageButton";
                if (language == this.state.languageFilter) {
                  divClass +=  " selected";
                }
                return (<div className={divClass} onClick={this.toggleFilter.bind(this,language)} key={language}>{language}</div>)
              })
            }
            </div>
            <div className="header cell">Forks Count</div>
          </div>
          {
            this.state.repos.map((repo, i) => { // Display each repo in a row
              if (!(this.state.languageFilter) || (repo.language == this.state.languageFilter)) { // Filter by language if languageFilter is present
                let rowColor = '';
                if ((i % 2) == 1) {
                  rowColor = "cell Odd";
                }
                else {
                  rowColor = "cell Even";
                }
                return (
                  <div className="Repos-table-row" key={repo.id}>
                    <div className={rowColor}>{repo.name}</div>
                    <div className={rowColor}>{repo.description}</div>
                    <div className={rowColor}>{repo.language}</div>
                    <div className={rowColor}>{repo.forks_count}</div>
                  </div>
                );
              }
              else {
                return;
              }
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
