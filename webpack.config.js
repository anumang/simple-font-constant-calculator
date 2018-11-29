
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8888";


module.exports = {
  entry: [
    './src/polyfill.js',
    './src/main.js',
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js'
  },
  module: {
    rules: [
		{
			test: /\.js$|\.jsx$/, exclude: /node_modules/, loaders: ['babel-loader'],
		},
		{
			test: /\.css$/, loaders: ['style-loader', 'css-loader']
		},
		{
			test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader']
		},
	],
  },
  resolve: {
	extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, "src"),
      path.join(__dirname, "node_modules"),
    ],
    alias: {
      // Alliases
    }
  },
  devServer: {
    contentBase: "./dist",
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: PORT,
    host: HOST
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      files: {
        css: ['style.css'],
        js: [ "bundle.js"],
      }
    }),
  ]
};