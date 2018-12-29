import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import compile from './compile';
import Template from './Template';
import LoadingScreen from './Load';
import page from './page';
import $ from 'jquery';
import './collapse';

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
    this.addClickHandlers();
  }

  addClickHandlers() {
    $('body').addCollapsibleHandlers();
    $('body').addLinkHandlers();
    $('body').addFootnoteHandlers();
    // $('table')
    //   .filter(function() {
    //     return $(this).find('thead th').length > 0;
    //   })
    //   .DataTable({
    //     bInfo: false,
    //     order: [],
    //     paging: false,
    //     searching: false
    // });
    // close table of contents
    $('#toc a[title]').each(function() {
      var link = $(this);
      link.click(function(event) {
        var button = $('#toc-button');
        button.click();
      });
    });
    // $('nav form').on('submit', Reference.searchHandler);
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
