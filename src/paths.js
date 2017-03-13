const path = require('path')

module.exports = {
  CWD: process.cwd(),
  NODE: process.argv[0],
  resolveService: file => path.resolve('/etc/systemd/system', file),
  SERVICE_FILES: '/etc/systemd/system',
  TARGET_PACKAGE: path.resolve(process.cwd(), 'package.json'),
  THIS_PACKAGE: path.resolve(__dirname, '../package.json'),
}
