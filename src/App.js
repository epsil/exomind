import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import Template from './Template';
import LoadingScreen from './Load';
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
      .then(text => this.setState(matter(text.trim())))
      .then(() => this.setState(this.state.data))
      .then(() => this.setState({
        markdown: this.state.content.trim(),
        content: md.render(this.state.content)
      }));
  }

  render() {
    if (this.state.content) {
      return <Template {...this.state}/>;
    } else {
      return <LoadingScreen/>;
    }
  }
}

export default App;
