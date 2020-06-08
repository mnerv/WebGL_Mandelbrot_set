const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Log configs
const stats = {
  children: false,
  colors: true,
  modules: false,
  timings: true,
}

// Webpack modules
const modules = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
        },
      ],
    },
    {
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
          options: { minimize: true },
        },
      ],
    },
    {
      test: /\.(png|svg|jpe?g|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            outputPath: 'assets/images',
            esModule: false,
          },
        },
      ],
    },
    {
      test: /\.(vert|frag)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            outputPath: 'assets/shaders',
          },
        },
      ],
    },
    {
      type: 'javascript/auto',
      test: /\.json$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            outputPath: 'assets/json',
          },
        },
      ],
    },
    {
      test: /\.scss$/,
      use: [
        // Creates `style` nodes from JS strings
        'style-loader',
        // Extract CSS into another file
        MiniCssExtractPlugin.loader,
        // Translates CSS into CommonJS
        'css-loader',
        // Compiles Sass to CSS
        'sass-loader',
      ],
    },
  ],
}

const plugins = [
  new HtmlWebpackPlugin({
    template: './src/public/index.html',
    filename: './index.html',
    favicon: './src/assets/favicon.png',
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css',
  }),
]

const devServer = {
  host: '0.0.0.0',
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
}

const output = {
  filename: '[name].[contenthash].js',
}

module.exports = {
  entry: './src/app.js',
  stats,
  module: modules,
  plugins,
  devServer,
  output,
}
