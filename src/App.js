import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import fetch from 'isomorphic-fetch';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import './App.css';

var md = new MarkdownIt();

class Template extends Component {
  render() {
    return (
      <div className="container">
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>
        <h1>{this.props.title}</h1>
        <p><strong>HTML</strong></p>
        <hr/>
        <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
        <hr/>
        <p><strong>HTML source</strong></p>
        <hr/>
        <pre>{this.props.content}</pre>
        <hr/>
        <p><strong>Markdown source</strong></p>
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
          <title>&hellip;</title>
        </Helmet>
        <h1>&hellip;</h1>
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
      .then(text => this.setState(matter(text.trim())))
      .then(() => this.setState(this.state.data))
      .then(() => this.setState({
        markdown: this.state.content.trim(),
        content: md.render(this.state.content),
        loaded: true
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
