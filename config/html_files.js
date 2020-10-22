const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ROOT_DIR = path.join(__dirname, '..')
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public')

module.exports = [
  new HtmlWebpackPlugin({
    template: path.join(PUBLIC_DIR, 'index.html'),
    favicon: path.join(PUBLIC_DIR, 'favicon.png'),
    filename: 'index.html',
    chunks: ['app'],
  }),
]
