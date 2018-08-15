import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import markdown from './markdown';
import util from './util';
import 'bootstrap/dist/css/bootstrap.css';

class Template extends Component {
  render() {
    return (
      <div className="container">
        <Helmet>
          <html
            prefix="og: http://ogp.me/ns#"
            {...(this.props.lang ? { lang: this.props.lang } : {})}
          />
          <title>{markdown.toText(this.props.title)}</title>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          {this.props.referrer ? (
            <meta content={this.props.referrer} name="referrer" />
          ) : (
            <meta content="no-referrer" name="referrer" />
          )}
          {this.props.noindex && <meta content="noindex" name="robots" />}
          {this.props.author && (
            <meta content={markdown.toText(this.props.author)} name="author" />
          )}
          {this.props.date && (
            <meta content={util.dateFormat(this.props.date)} name="date" />
          )}
        </Helmet>
        <header>
          <h1
            dangerouslySetInnerHTML={{
              __html: markdown.inline(this.props.title)
            }}
          />
          {this.props.author && <h2>{this.props.author}</h2>}
        </header>
        <article dangerouslySetInnerHTML={{ __html: this.props.content }} />
      </div>
    );
  }
}

export default Template;
