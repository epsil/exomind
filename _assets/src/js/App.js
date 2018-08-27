import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import compile from './compile';
import matter from 'gray-matter';
import Template from './Template';
import LoadingScreen from './Load';
import page from './page';
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
      .then(text => {
        this.setState(compile(text, page.path()));
        this.setState({
          markdown: text
        });
      });
  }

  render() {
    if (!this.state.markdown) {
      return <LoadingScreen />;
    } else {
      return <Template {...this.state} />;
    }
  }
}

export default App;
