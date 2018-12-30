import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import * as openpgp from 'openpgp';
import compile from './compile';
import Template from './Template';
import Prompt from './Prompt';
import LoadingScreen from './Load';
import page from './page';
import Reference from './reference';
import $ from 'jquery';
import settings from '../json/settings.json';
import './collapse';

// openpgp.initWorker({ path: 'openpgp.worker.js' }); // set the relative web worker path

// var settings = {
//   noindex: true
// };

class App extends Component {
  constructor(props) {
    super(props);
    this.update = true;
    this.state = settings;
    // this.componentDidMount = this.componentDidMount.bind(this);
    this.loadMarkdown = this.loadMarkdown.bind(this);
    this.compileMarkdown = this.compileMarkdown.bind(this);
    this.decrypt = this.decrypt.bind(this);
    this.fetchMarkdown = this.fetchMarkdown.bind(this);
    // this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.addClickHandlers = this.addClickHandlers.bind(this);
    // this.render = this.render.bind(this);
  }

  async componentDidMount() {
    let md = await this.fetchMarkdown();
    this.loadMarkdown(md);
  }

  loadMarkdown(md) {
    let isEncryptedMessage = md.match(/^-+BEGIN PGP MESSAGE/);
    if (isEncryptedMessage) {
      this.setState({
        ciphertext: md.trim(),
        prompt: true
      });
    } else {
      this.compileMarkdown(md);
    }
  }

  compileMarkdown(md) {
    this.setState(compile(md, page.path()));
    this.setState({
      markdown: md
    });
    this.update = false;
    this.addClickHandlers();
  }

  async decrypt(pass) {
    try {
      let plaintext = await openpgp.decrypt({
        message: await openpgp.message.readArmored(this.state.ciphertext), // parse armored message
        passwords: [pass], // decrypt with password
        format: 'utf8'
      });
      this.setState({
        invalidPassword: false,
        prompt: false
      });
      this.compileMarkdown(plaintext.data);
    } catch (err) {
      this.setState({
        invalidPassword: true
      });
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
      return (
        <Prompt callback={this.decrypt} invalid={this.state.invalidPassword} />
      );
    } else if (!this.state.markdown) {
      return <LoadingScreen />;
    } else {
      return <Template {...this.state} />;
    }
  }
}

export default App;
