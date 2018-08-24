import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import markdown from './markdown';
import compile from './compile';
import matter from 'gray-matter';
import Template from './Template';
import LoadingScreen from './Load';
import util from './util';
import '../css/App.css';

var settings = {
  noindex: true
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = settings;
  }

  // componentDidMount() {
  //   fetch('index.md')
  //     .then(response => response.text())
  //     .then(text => this.setState(matter(text.trim())))
  //     // .then(() => this.setState(this.state.data))
  //     .then(() => {
  //       alert(compile(this.state));
  //       return this.setState({
  //         markdown: this.state.content.trim(),
  //         content: markdown(this.state.content)
  //       });
  //     });
  // }

  componentDidMount() {
    fetch('index.md')
      .then(response => response.text())
      .then(text => {
        this.setState(compile(text));
        // alert(util.prettyJSON(this.state));
        this.setState({
          markdown: text
        });
      });
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
