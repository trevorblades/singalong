const HtmlWebpackPlugin = require('html-webpack-plugin');
const {resolve} = require('path');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const merge = require('webpack-merge');

const PORT = 3000;
const APP_TITLE = 'Singalong';

const branchName = process.env.CIRCLE_BRANCH;
const PRODUCTION_BRANCH = 'master';
const PUBLIC_PATH =
  branchName && branchName !== PRODUCTION_BRANCH ? `/${branchName}/` : '/';

const config = {
  entry: {
    main: ['./src/index']
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: resolve(__dirname, 'build'),
    publicPath: PUBLIC_PATH
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: APP_TITLE,
      template: './src/index.ejs'
    }),
    new webpack.DefinePlugin({
      APP_TITLE: JSON.stringify(APP_TITLE),
      PUBLIC_PATH: JSON.stringify(PUBLIC_PATH)
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  module.exports = config;
} else {
  module.exports = merge(
    {
      entry: {
        main: [
          'react-hot-loader/patch',
          `webpack-dev-server/client?http://localhost:${PORT}`,
          'webpack/hot/only-dev-server'
        ]
      }
    },
    config,
    {
      output: {
        filename: '[name].js'
      },
      devtool: 'inline-source-map',
      devServer: {
        hot: true,
        port: PORT,
        historyApiFallback: true
      },
      plugins: [
        new DashboardPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
      ]
    }
  );
}
