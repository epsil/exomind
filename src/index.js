import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './js/App';
import registerServiceWorker from './js/registerServiceWorker';

const body = document.body;
const div = document.createElement('div');
body.appendChild(div);
ReactDOM.render(<App />, div);

registerServiceWorker();
