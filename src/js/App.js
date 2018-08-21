import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import markdown from './markdown';
import matter from 'gray-matter';
import Template from './Template';
import LoadingScreen from './Load';
import '../css/App.css';

var settings = {
  noindex: true
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = settings;
  }

  componentDidMount() {
    fetch('index.md')
      .then(response => response.text())
      .then(text => this.setState(matter(text.trim())))
      .then(() => this.setState(this.state.data))
      .then(() =>
        this.setState({
          markdown: this.state.content.trim(),
          content: markdown(this.state.content)
        })
      );
  }

  render() {
    if (this.state.markdown) {
      return <Template {...this.state} />;
    } else {
      return <LoadingScreen />;
    }
  }
}

export default App;
