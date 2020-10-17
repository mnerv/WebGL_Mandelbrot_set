const path = require('path')

const ROOT_DIR = path.join(__dirname, '..')
const SANDBOX_DIR = path.join(ROOT_DIR, 'src', 'Sandbox')
const STYLE_DIR = path.join(ROOT_DIR, 'public', 'styles')

module.exports = {
  app: [path.join(SANDBOX_DIR, 'app.ts'), path.join(STYLE_DIR, 'main.scss')],
}
