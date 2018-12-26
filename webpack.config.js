var path = require('path');

module.exports = {
  mode: 'development',
  entry: './_assets/src/index.js',
  output: {
    path: path.resolve(__dirname, '_assets/build/static/js'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  }
};
