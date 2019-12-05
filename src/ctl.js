const fs = require('fs')
const childProcess = require('child_process')
const paths = require('./paths')
const service = require('./service')

const packageJson = fs.existsSync(paths.TARGET_PACKAGE)
  ? require(paths.TARGET_PACKAGE)
  : {}

function systemctl(command, file) {
  return childProcess.exec(`systemctl ${command} ${file || ''}`, (err, stdout, stderr) => {
    if (stdout) {
      return console.log(stdout)
    }
    if (stderr) {
      return console.log(stderr)
    }
    if (err) throw err
    return 0
  })
}

module.exports = function ctl(yargs) {
  const argv = Object.assign(
    {},
    yargs,
    {
      execstart: yargs.execstart || `${paths.NODE} ${paths.CWD}/${packageJson.main}`,
      workingdirectory: yargs.workingdirectory || paths.CWD,
    }
  )

  const command = argv._[0]
  const extension = '.jsctl.service'
  const name = argv._[1] ? argv._[1] : packageJson.name
  const file = `${name}${extension}`

  if (name === undefined && command !== 'list') {
    return console.error('Please specify a name.')
  }

  switch (command) {
    case 'add':
      return fs.writeFile(paths.resolveService(file), service.generate(argv), 'utf-8', (err) => {
        if (err) return console.error(err)
        return console.log(`created ${name}`)
      })
    case 'gen':
      return fs.writeFile(file, service.generate(argv), 'utf-8', (err) => {
        if (err) return console.error(err)
        return console.log(`created ${name}`)
      })

    case 'list':
      return fs.readdir(paths.SERVICE_FILES, (err, data) => {
        if (err) return console.error(err)
        return console.log(
          data
            .filter(entry => entry.includes(extension))
            .map(entry => entry.replace(extension, ''))
            .join('\n')
        )
      })

    case 'remove':
      return fs.unlink(paths.resolveService(file), (err) => {
        if (err) return console.error(err)
        return console.log(`removed ${name}`)
      })

    case 'daemon-reload':
      return systemctl('daemon-reload')

    default:
      return systemctl(command, file)
  }
}
