/**
 * 弃用 --- 开始使用多环境不同配置
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // 使用SplitChunksPlugin不需要安装任何依赖，只需在 webpack.config.js 中的 config对象添加 optimization 属性：
  optimization: {
    splitChunks: {
      chunks: 'initial',
      automaticNameDelimiter: '.',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 1
        }
      }
    },
    runtimeChunk: {
      name: entrypoint => `manifest.${entrypoint.name}`
    }
  },
  // entry: './src/index.js',
  entry: {
    app: './src/index.js',
    // print: './src/print.js'
  },
  // 为了更容易地追踪错误和警告，JavaScript 提供了 source map 功能，将编译后的代码映射回原始源代码。
  devtool: 'inline-source-map',
  // webpack-dev-server 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
  devServer: {
    // 修改配置文件，告诉开发服务器(dev server)，在哪里查找文件：
    contentBase: './dist',
    hot: true // HMR 模块热替换 它允许在运行时更新各种模块，而无需进行完全刷新。
  },
  plugins: [
    // 在每次构建前清理 /dist 文件夹
    new CleanWebpackPlugin(),
    // HtmlWebpackPlugin简化了HTML文件的创建
    // 该插件将为你生成一个 HTML5 文件， 其中包括使用 script 标签的 body 中的所有 webpack 包
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // webpack-bundle-analyzer，这个插件会清晰的展示出打包后的各个bundle所依赖的模块
    new BundleAnalyzerPlugin(),
    // Workbox
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助 ServiceWorkers 快速启用
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    // filename: 'bundle.js',
    // filename: '[name].bundle.js',
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  // 通过 "mode" 配置选项轻松切换到压缩输出，只需设置为 "production" & 同时 加载了摇树 🌲
  mode: "production",
  module: {
    rules: [
      // webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader。在这种情况下，以 .css 结尾的全部文件，都将被提供给 style-loader 和 css-loader。
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // 使用 file-loader，我们可以轻松地将这些内容混合到 CSS 中：
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      // file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体。
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};