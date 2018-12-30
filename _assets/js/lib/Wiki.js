import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import * as openpgp from 'openpgp';
import datatables from 'datatables';
import $ from 'jquery';
import Template from './Template';
import Prompt from './Prompt';
import LoadingScreen from './Load';
import compile from './compile';
import page from './page';
import Reference from './reference';
import settings from '../json/settings.json';
import collapse from './collapse';
import util from './util';

class Wiki extends Component {
  constructor(props) {
    super(props);
    this.update = true;
    this.state = settings;
    this.loadMarkdown = this.loadMarkdown.bind(this);
    this.compileMarkdown = this.compileMarkdown.bind(this);
    this.decrypt = this.decrypt.bind(this);
    this.fetchMarkdown = this.fetchMarkdown.bind(this);
    this.addClickHandlers = this.addClickHandlers.bind(this);
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
    this.moveToHashOnLoad();
  }

  async decrypt(pass) {
    this.setState({ disabledPrompt: true });
    try {
      let plaintext = await openpgp.decrypt({
        message: await openpgp.message.readArmored(this.state.ciphertext), // parse armored message
        passwords: [pass], // decrypt with password
        format: 'utf8'
      });
      this.setState({
        disabledPrompt: false,
        invalidPassword: false,
        prompt: false
      });
      this.compileMarkdown(plaintext.data);
    } catch (err) {
      this.setState({
        disabledPrompt: false,
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
    $('table')
      .filter(function() {
        return $(this).find('thead th').length > 0;
      })
      .DataTable({
        bInfo: false,
        order: [],
        paging: false,
        searching: false
      });
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

  moveToHashOnLoad(hash) {
    var self = this;
    self.moveToHash(hash);
    $(function() {
      self.moveToHash(hash);
      var hasImages = $('article img').length > 0;
      var hasTables = $('article table').length > 0;
      var hasDynamicElements = hasImages || hasTables;
      if (hasDynamicElements) {
        setTimeout(function() {
          self.moveToHash(hash);
        }, 500);
      }
    });
  }

  moveToHash(hash) {
    hash = hash || page.hashArgs(0);
    if (hash && hash !== '#') {
      var decodedHash = decodeURIComponent(hash);
      var latin1Hash = '#' + util.slugify(decodedHash);
      var hashContainsSpacesOrLargeLetters = hash !== latin1Hash;
      if (hashContainsSpacesOrLargeLetters) {
        hash = latin1Hash;
      }
      var target = $(hash).first();
      if (target.length) {
        collapse.unhideSection(target);
        this.scrollToElement(target);
      }
    }
  }

  scrollToElement(el, offset, time) {
    offset = offset || -50;
    time = time || 0;
    $(window).scrollTop(el.offset().top + offset);
  }

  render() {
    if (this.state.prompt) {
      return (
        <Prompt
          callback={this.decrypt}
          invalid={this.state.invalidPassword}
          disabled={this.state.disabledPrompt}
        />
      );
    } else if (!this.state.markdown) {
      return <LoadingScreen />;
    } else {
      return <Template {...this.state} />;
    }
  }
}

export default Wiki;
