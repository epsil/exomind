var path = require('path');

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './_assets/src/index.js'],
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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['file-loader']
      }
    ]
  }
};
