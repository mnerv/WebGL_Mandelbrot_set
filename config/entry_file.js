const path = require('path')

const ROOT_DIR = path.join(__dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')
const STYLE_DIR = path.join(ROOT_DIR, 'public', 'styles')

module.exports = {
  app: [path.join(SRC_DIR, 'app.ts'), path.join(STYLE_DIR, 'main.scss')],
}
