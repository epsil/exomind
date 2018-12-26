import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function bootstrap() {
  document.addEventListener('DOMContentLoaded', function(event) {
    const body = document.body;
    const div = document.createElement('div');
    body.appendChild(div);
    ReactDOM.render(<App />, div);
  });
}

bootstrap();
