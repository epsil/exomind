import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import compile from './compile';
import Template from './Template';
import Prompt from './Prompt';
import LoadingScreen from './Load';
import page from './page';
import Reference from './reference';
import $ from 'jquery';
import './collapse';

var settings = {
  noindex: true
};

class App extends Component {
  constructor(props) {
    super(props);
    this.update = true;
    this.state = settings;
  }

  async componentDidMount() {
    let md = await this.fetchMarkdown();
    this.compileMarkdown(md);
  }

  compileMarkdown(md) {
    let isEncryptedMessage = md.match(/^-+BEGIN PGP MESSAGE/);
    if (isEncryptedMessage) {
      this.setState({
        prompt: true
      });
    } else {
      this.setState(compile(md, page.path()));
      this.setState({
        markdown: md
      });
      this.update = false;
      this.addClickHandlers();
    }
  }

  async fetchMarkdown() {
    let response = null;
    try {
      response = await fetch('index.md');
    } catch (err) {
      try {
        response = await fetch('index.md.asc');
      } catch (err) {}
    }
    if (!response) {
      return '';
    } else {
      let md = await response.text();
      return md;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.update;
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
    $('.navbar-left').fixLinks();
    // close table of contents
    $('#toc a[title]').each(function() {
      var link = $(this);
      link.click(function(event) {
        var button = $('#toc-button');
        button.click();
      });
    });
    $('nav form').on('submit', Reference.searchHandler);
  }

  render() {
    if (this.state.prompt) {
      return <Prompt />;
    } else if (!this.state.markdown) {
      return <LoadingScreen />;
    } else {
      return <Template {...this.state} />;
    }
  }
}

export default App;
