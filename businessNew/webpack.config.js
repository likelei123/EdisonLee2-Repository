
var path = require('path');
var webpack = require('webpack');

// sass 分离插件  和  复制粘贴插件
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var sassExtractor = new ExtractTextPlugin('[name].css');
// var CopyWebpackPlugin = require('copy-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin');


//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');


// var copyWebpackPlugin = new CopyWebpackPlugin([
//   {from: './application/main/static/main.html'},
// ]);

module.exports = {
  entry: {
    access: './app/access.js'
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template:'./app/access.html',
      inject:true
    }),

    new webpack.optimize.DedupePlugin(),

    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.(png|jpg|ttf|gif)$/,
        loader: 'url?limit=40000',
        include: ROOT_PATH,
      },
      {
        test: /\.(css|scss)$/,
        loader: ['style-loader', 'css-loader', 'sass-loader'],
        include: ROOT_PATH,
      },
      {
          test: /\.html$/,
          loaders: ['html'],
          include: ROOT_PATH,
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    host: '192.168.1.21',
    port: 8888
    // proxy: {
    //   '/service_v2.0/*': {
    //       // target: 'http://139.198.3.243:80', //正式 
    //       // target: 'http://139.198.3.148:80', //测试
    //       target: 'http://192.168.31.92:80', //开发
    //       secure: false
    //   }
    // }
  }
};