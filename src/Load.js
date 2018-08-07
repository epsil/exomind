import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.css';

class LoadingScreen extends Component {
  render() {
    return (
      <div className="container">
        <Helmet>
          <title>&hellip;</title>
        </Helmet>
        <h1>&hellip;</h1>
      </div>
    );
  }
}

export default LoadingScreen;
