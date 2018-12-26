import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class LoadingScreen extends Component {
  render() {
    return (
      <div className="text-center">
        <Helmet>
          <title>&hellip;</title>
        </Helmet>
        <h1>&hellip;</h1>
      </div>
    );
  }
}

export default LoadingScreen;
