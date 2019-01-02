/* global document:true, window:true, jQuery:true */
/* exported jQuery */
const jsdom = require('jsdom');

// Set up jsdom so that jQuery will work
document = jsdom.jsdom();
window = document.defaultView;

// Set up jQuery
const $ = require('jquery');

jQuery = $;

// Transpile all code following this line with babel
// and use 'env' (aka ES6) preset
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
});
require('@babel/polyfill');

// Import the rest of the application
require('./build-script.js');
