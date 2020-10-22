const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const path = require('path')

const entry = require('./config/entry_file')
const HTML_FILES = require('./config/html_files')

const ROOT_DIR = path.resolve(__dirname)
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public')

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/'

// Log configs
const stats = {
  children: false,
  colors: true,
  modules: false,
  timings: true,
}

// Modules
const modules = {
  rules: [
    {
      test: /\.ts?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.build.json',
          },
        },
      ],
    },
    {
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
        },
      ],
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            outputPath: 'static',
            useRelativePaths: true,
          },
        },
      ],
    },
    {
      test: /\.(vert|frag)$/i,
      use: [
        {
          loader: 'raw-loader',
          options: {
            esModule: false,
          },
        },
      ],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        // 'style-loader', // Creates `style` nodes from JS strings
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    },
  ],
}

const resolve = {
  extensions: ['.ts', '.js'],
  alias: {
    src: path.resolve(__dirname, 'src'),
    Assets: path.resolve(__dirname, 'src/Assets'),
    DOM: path.resolve(__dirname, 'src/DOM'),
    Engine: path.resolve(__dirname, 'src/Engine'),
    Sandbox: path.resolve(__dirname, 'src/Sandbox'),
  },
}

// Plugins
const plugins = [
  ...HTML_FILES,
  new FaviconsWebpackPlugin({
    logo: path.join(PUBLIC_DIR, 'favicon.png'),
    cache: true,
    publicPath: PUBLIC_PATH,
    outputPath: '/static/assets',
  }),
  new MiniCssExtractPlugin({
    filename: 'static/[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css',
  }),
]

// Ouput
const output = {
  publicPath: PUBLIC_PATH,
  path: path.join(__dirname, 'dist'),
  filename: 'static/[name].[contenthash].js',
}

module.exports = {
  entry,
  mode: 'production',
  optimization: {
    usedExports: true,
  },
  stats,
  module: modules,
  resolve,
  plugins,
  output,
  watchOptions: {
    ignored: /node_modules|build|dist/,
  },
}
