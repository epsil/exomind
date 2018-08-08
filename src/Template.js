import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import markdown from './markdown';
import 'bootstrap/dist/css/bootstrap.css';

class Template extends Component {
  render() {
    return (
      <div className="container">
        <Helmet>
          <html prefix="og: http://ogp.me/ns#" {...(this.props.lang ? {lang: this.props.lang} : {})} />
          <title>{markdown.toText(this.props.title)}</title>
        </Helmet>
        <header>
        <h1 dangerouslySetInnerHTML={{__html: markdown.inline(this.props.title)}}></h1>
          {this.props.author &&
           <h2>{this.props.author}</h2>
          }
        </header>
        <article dangerouslySetInnerHTML={{__html: this.props.content}}>
        </article>
      </div>
    );
  }
}

export default Template;
