import React from 'react';
import ReactDOM from 'react-dom';
import Wiki from './Wiki';
import './global';

function bootstrapWiki() {
  document.addEventListener('DOMContentLoaded', function(event) {
    const body = document.body;
    const div = document.createElement('div');
    body.appendChild(div);
    ReactDOM.render(<Wiki />, div);
  });
}

bootstrapWiki();
