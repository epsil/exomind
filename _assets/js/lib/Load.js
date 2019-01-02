import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

const LoadingScreen = props => (
  <div className="text-center">
    <Helmet>
      {/* <title>&hellip;</title> */}
      <title />
    </Helmet>
    {/* <h1>&hellip;</h1> */}
    <h1 />
  </div>
);

export default LoadingScreen;
