import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import compile from './compile';
import Template from './Template';
import LoadingScreen from './Load';
import page from './page';
import '../../css/App.css';

var settings = {
  noindex: true
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = settings;
  }

  async componentDidMount() {
    let response = await fetch('index.md');
    let text = await response.text();
    this.setState(compile(text, page.path()));
    this.setState({
      markdown: text
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
