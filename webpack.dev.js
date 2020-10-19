const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const entry = require('./config/entry_file')
const HTML_FILES = require('./config/html_files')

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
            name: '[name].[ext]',
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
    src: path.resolve(__dirname, 'src/'),
    Assets: path.resolve(__dirname, 'src/Assets/'),
    Engine: path.resolve(__dirname, 'src/Engine/'),
    Sandbox: path.resolve(__dirname, 'src/Sandbox/'),
  },
}

// Plugins
const plugins = [
  ...HTML_FILES,
  new MiniCssExtractPlugin({
    filename: 'static/[name].css',
    chunkFilename: '[id].css',
  }),
]

// Ouput
const output = {
  publicPath: '/',
  path: path.join(__dirname, 'dist'),
  filename: 'static/[name].js',
}

module.exports = {
  entry,
  mode: 'development',
  optimization: {
    usedExports: true,
  },
  stats,
  module: modules,
  devtool: 'inline-source-map',
  resolve,
  plugins,
  output,
  watchOptions: {
    ignored: /node_modules|build|dist/,
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    publicPath: '/',
  },
}
