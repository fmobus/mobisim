var webpack = require('webpack');

module.exports = {
  contentBase: __dirname,
  context: __dirname,
  entry: './src/app.js',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', include: /src/, query: { presets: ['es2015', 'react'] } }

    ]
  },
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.MAPBOX_TOKEN': JSON.stringify(process.env.MAPBOX_TOKEN || '')
    })
  ]
};
