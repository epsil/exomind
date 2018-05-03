import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import fetch from 'isomorphic-fetch';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    fetch('index.md')
      .then(response => response.text())
      .then(text => this.setState({ markdown: text }));
      // .then(response => response.json())
      // .then(json => json.map(country => country.name))
      // .then(countryNames => this.setState({ countryNames, loading: false }));
  }

  render() {
    return this.state.markdown ? (
      <div>
        <Helmet>
          <title>Markdown</title>
        </Helmet>
        <h1>Markdown</h1>
        <pre>{this.state.markdown}</pre>
      </div>
    ) : (
      <div>
        <Helmet>
          <title>Loading Markdown ...</title>
        </Helmet>
        <h1>Loading Markdown ...</h1>
      </div>
    );
  }
}

export default App;
