var jsdom = require('jsdom');
document = jsdom.jsdom();
window = document.defaultView;

// Transpile all code following this line with babel and use 'env' (aka ES6) preset
require('@babel/register')({
  presets: ['@babel/preset-env']
});
require('@babel/polyfill');

// Import the rest of our application
require('./build_script.js');
