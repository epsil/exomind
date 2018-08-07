import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import fetch from 'isomorphic-fetch';
import MarkdownIt from 'markdown-it';
import './App.css';

var md = new MarkdownIt();

class Template extends Component {
  render() {
    return (
      <div className="container">
        <Helmet>
          <title>Markdown</title>
        </Helmet>
        <h1>Markdown</h1>
        <p><strong>HTML</strong></p>
        <hr/>
        <div dangerouslySetInnerHTML={{__html: this.props.html}}></div>
        <hr/>
        <p><strong>Markdown</strong></p>
        <hr/>
        <pre>{this.props.markdown}</pre>
        <hr/>
      </div>
    );
  }
}

class LoadingScreen extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Loading Markdown ...</title>
        </Helmet>
        <h1>Loading Markdown ...</h1>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    fetch('index.md')
      .then(response => response.text())
      .then(text => this.setState({
        loaded: true,
        markdown: text,
        html: md.render(text)
      }));
  }

  render() {
    if (this.state.loaded) {
      return <Template {...this.state}/>;
    } else {
      return <LoadingScreen/>;
    }
  }
}

export default App;
