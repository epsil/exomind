import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

const body = document.body;
const div = document.createElement('div');
body.appendChild(div);
ReactDOM.render(<App />, div);
// ReactDOM.render(<App />, body);

registerServiceWorker();
