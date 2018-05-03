import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import fetch from 'isomorphic-fetch';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryNames: [],
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    fetch('https://restcountries.eu/rest/v1/all')
      .then(response => response.json())
      .then(json => json.map(country => country.name))
      .then(countryNames => this.setState({ countryNames, loading: false }));
  }

  render() {
    const { countryNames, loading } = this.state;
    return loading ? (
      <div>
        <Helmet>
          <title>Loading Country Names...</title>
        </Helmet>
        <div>Loading Country Names...</div>
      </div>
    ) : !countryNames.length ? (
      <div>
        <Helmet>
          <title>No country Names</title>
        </Helmet>
        <div>No country Names</div>
      </div>
    ) : (
      <div>
        <Helmet>
          <title>Country Names</title>
        </Helmet>
        <h1>Country Names</h1>
        <ul>{countryNames.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </div>
    );
  }
}

export default App;
