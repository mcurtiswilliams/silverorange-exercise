import React from 'react';
const fetch = require('node-fetch');

import './App.css';

class App extends React.Component { // Create App class
  constructor (props) {
    super(props);

    this.state = { // Create state for App
      repos: [], // Placeholder for loading in repos data
      dataIsLoaded: false, // Flag whether the data has been loaded
      language: [], // A list of all languages found in the repos data
      languageFilter: null, // Filter the repos by the selected language (default: null)
      displayRepo: false, // Boolean to determine whether a repo has been clicked and should be displayed
      displayedRepo: {}, // The repo to be displayed
      displayedREADME: null, // The README.md file from the displayed repo
      displayedCommit: null // The commit information for the displayed repo
    }
  }

  componentDidMount() { // When component mounts, read data from repos API running on localhost:4000
    fetch ('http://localhost:4000/repos') // Fetch the repos from the API (B. 1.)
      .then((res) => res.json())
      .then((json) => {
        json.sort(function (a, b) { // Sort json by reverse chronological order (B. 3.)
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
          languages: languages

        });
      });
  }

  displayRepo (repo) { // Set the state with the data related to the selected repository
    this.setState ({
      displayRepo: true,
      displayedRepo: repo
    });
    fetch ('https://raw.githubusercontent.com/'+repo.full_name+'/master/README.md') // Fetch the README.md file
      .then((response) => {
        if (response.ok) { return response.text();}
      })
      .then((result) => this.setState({ displayedREADME: result}));
    fetch ('http://localhost:4000/repos/repo/' + repo.name) // Fetch the commit information
      .then ((response) => {
        if (response.ok) { return response.json();}
      })
      .then((result) => this.setState({ displayedCommit: result }));
  }

  hideRepo () {
    this.setState ({ // Reset state related to the displayed repo when toggled
      displayRepo: false,
      displayedRepo: null,
      displayedREADME: null,
      displayedCommit: null
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
      if (this.state.displayRepo && !!this.state.displayedRepo && !!this.state.displayedCommit) { // Display the repo data if one has been clicked (B. 5 - 8)
        return (
          <div className="Repo-display">
            <div className="back-button" onClick={this.hideRepo.bind(this)}>Go back</div>
            <div className="header repoCell">Name of repository:</div>
            <div className="repoCell">{this.state.displayedRepo.name}</div>
            <div className="header repoCell">Date of most recent commit:</div>
            <div className="repoCell">{(!!this.state.displayedCommit.commit) ? this.state.displayedCommit.commit.author.date : ""}</div>
            <div className="header repoCell">Author of most recent commit:</div>
            <div className="repoCell">{(!!this.state.displayedCommit.commit) ? this.state.displayedCommit.commit.author.name : ""}</div>
            <div className="header repoCell">Message from most recent commit:</div>
            <div className="repoCell">{(!!this.state.displayedCommit.commit) ? this.state.displayedCommit.commit.message : ""}</div>
            <div className="header repoCell">Contents of README.md</div>
            <div className="readme repoCell">
              {(!!this.state.displayedREADME) ? this.state.displayedREADME : "No README.md found"}
            </div>
          </div>
        )
      }
      else { // Default repos table display
        return (
          <div className="Repos-table">
            <div className="Repos-table-row">
              <div className="header cell">Name</div>
              <div className="header cell">Description</div>
              <div className="header cell">Language
              {
                this.state.languages.map(language => { // Create buttons for each language (B. 4.)
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
              this.state.repos.map((repo, i) => { // Display each repo in a row (B. 2.)
                if (!(this.state.languageFilter) || (repo.language == this.state.languageFilter)) { // Filter by language if languageFilter is present
                  let rowColor = ''; // Create alternating colours for the rows
                  if ((i % 2) == 1) {
                    rowColor = "cell Odd";
                  }
                  else {
                    rowColor = "cell Even";
                  }
                  return (
                    <div className="Repos-table-row click" key={repo.id} onClick={this.displayRepo.bind(this, repo)}>
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
    }
    else { // If data has not been loaded, display loading message
      return (
        <div>Loading ...</div> // Display loading message
      );
    }
  }
}

export default App;
