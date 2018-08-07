import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const body = document.body;
const div = document.createElement('div');
body.appendChild(div);
ReactDOM.render(<App />, div);

registerServiceWorker();
