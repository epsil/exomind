import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import fetch from 'isomorphic-fetch';
import MarkdownIt from 'markdown-it';
import './App.css';

var md = new MarkdownIt();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    fetch('index.md')
      .then(response => response.text())
      .then(text => md.render(text))
      .then(html => this.setState({ markdown: html }));
  }

  render() {
    return this.state.markdown ? (
      <div>
        <Helmet>
          <title>Markdown</title>
        </Helmet>
        <h1>Markdown</h1>
        <div dangerouslySetInnerHTML={{__html: this.state.markdown}}></div>
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
