import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.css';

class Template extends Component {
  render() {
    return (
      <div className="container">
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>
        <header>
          <h1>{this.props.title}</h1>
        </header>
        <article dangerouslySetInnerHTML={{__html: this.props.content}}>
        </article>
      </div>
    );
  }
}

export default Template;
