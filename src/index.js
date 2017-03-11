#!/usr/bin/env node

const fs = require('fs')
const childProcess = require('child_process')

const serviceFileName = name => `${name}.jsctl.service`

const argOrPackage = argv => argv.name ? argv.name : packageJson(argv).name

const service = argv => serviceFileName(argOrPackage(argv))

const servicePath = argv => `/etc/systemd/system/${serviceFileName(argOrPackage(argv))}`

const packageJson = argv => require(`${argv.directory}/package.json`)

const serviceFile = argv => `[Unit]
Description=${argOrPackage(argv)}
Wants=${argv.wants}

[Service]
ExecStart=${argv.nodepath} ${argv.directory}/${argv.scriptpath ? argv.scriptpath : packageJson(argv).main}
WorkingDirectory=${argv.directory}
User=${argv.user}
Restart=${argv.restart}
RestartSec=${argv.timeout}
StandardOutput=${argv.stdout}
StandardError=${argv.stderr}
Environment=${argv.env}
${argv.custom.replace('\\n', '\n')}

[Install]
WantedBy=${argv.wantedby}
`

const exec = cmd =>
  new Promise((resolve, reject) =>
    childProcess.exec(cmd, (err, stdout, stderr) => {
      if (stdout) {
        console.log(stdout)
        return resolve(stdout)
      }
      if (stderr) {
        console.log(stderr)
        return resolve(stderr)
      }
      if (err) return reject(err)
      return resolve()
    }))

const argv = require('yargs')

  .usage('Usage: jsctl <command> [options]')

  .command({
    command: 'cat',
    desc: 'Display a service file',
    handler: (argv) =>
      exec(`systemctl cat ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'daemon-reload',
    desc: 'Reload the daemon',
    handler: (argv) =>
      exec('systemctl daemon-reload')
        .catch(err => console.error(err))
  })

  .command({
    command: 'disable',
    desc: 'Disable a service',
    handler: (argv) =>
      exec(`systemctl disable ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'enable',
    desc: 'Enable a service',
    handler: (argv) =>
      exec(`systemctl enable ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'generate',
    desc: 'Generate a service file',
    handler: (argv) => {
      const filePath = servicePath(argv)
      fs.writeFile(filePath, serviceFile(argv), 'utf-8', (err) => {
        if (err) return console.error(err)
        return console.log(`created ${filePath}`)
      })
    }
  })

  .command({
    command: 'is-active',
    desc: 'See if active',
    handler: (argv) =>
      exec(`systemctl is-active ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'is-enabled',
    desc: 'See if enabled',
    handler: (argv) =>
      exec(`systemctl is-enabled ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'is-failed',
    desc: 'See if failed',
    handler: (argv) =>
      exec(`systemctl is-failed ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'list',
    desc: 'List services',
    handler: () =>
      fs.readdir('/etc/systemd/system', (err, data) => {
        if (err) return console.error(err)
        return console.log(
          data
            .filter(entry => entry.includes('.jsctl.service'))
            .map(entry => entry.replace('.jsctl.service', ''))
            .join('\n')
        )
      })
  })

  .command({
    command: 'list-dependencies',
    desc: 'List service dependencies',
    handler: (argv) =>
      exec(`systemctl list-dependencies ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'reload',
    desc: 'Reload a service',
    handler: (argv) =>
      exec(`systemctl reload ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'reload-or-restart',
    desc: 'Reload or restart service',
    handler: (argv) =>
      exec(`systemctl reload-or-restart ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'remove',
    desc: 'Remove a service file',
    handler: (argv) => {
      const filePath = servicePath(argv)
      return fs.unlink(filePath, (err) => {
        if (err) return console.error(err)
        return console.log(`removed ${filePath}`)
      })
    }
  })

  .command({
    command: 'restart',
    desc: 'Restart a service',
    handler: (argv) =>
      exec(`systemctl restart ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'show',
    desc: 'Show service properties',
    handler: (argv) =>
      exec(`systemctl show ${service(argv)}`)
        .catch(err => console.error(err))
  })
  .command({
    command: 'start',
    desc: 'Start a service',
    handler: (argv) =>
      exec(`systemctl start ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'status',
    desc: 'See the status of a service',
    handler: (argv) =>
      exec(`systemctl status ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .command({
    command: 'stop',
    desc: 'Stop a service',
    handler: (argv) =>
      exec(`systemctl stop ${service(argv)}`)
        .catch(err => console.error(err))
  })

  .option('custom', {
    describe: 'Custom [Service] options, e.g. --custom \'SuccessExitStatus=1\\nType=simple\'',
    default: '',
  })

  .option('d', {
    alias: 'directory',
    describe: 'Path to project folder with package.json (default: process.cwd())',
    default: process.cwd(),
  })

  .option('e', {
    alias: 'env',
    describe: 'Evironment',
    default: 'NODE_ENV=production',
  })

  .option('n', {
    alias: 'name',
    describe: 'Name of a generated service',
  })

  .option('nodepath', {
    describe: 'Path to node binary (default: process.argv[0])',
    default: process.argv[0],
  })

  .option('restart', {
    default: 'always',
    choices: [
      'no',
      'always',
      'on-success',
      'on-failure',
      'on-abnormal',
      'on-abort',
      'on-watchdog',
    ]
  })

  .option('s', {
    alias: 'scriptpath',
    describe: 'Path to your JavaScript file (default: main entry in package.json)',
  })

  .option('stdout', {
    describe: 'StandardOut',
    default: 'syslog',
    choices: [
      'inherit',
      'null',
      'tty',
      'journal',
      'syslog',
      'kmsg',
      'journal+console',
      'syslog+console',
      'kmsg+console',
      'socket'
    ],
  })

  .option('stderr', {
    describe: 'StandardError',
    default: 'syslog',
    choices: [
      'inherit',
      'null',
      'tty',
      'journal',
      'syslog',
      'kmsg',
      'journal+console',
      'syslog+console',
      'kmsg+console',
      'socket'
    ],
  })

  .option('t', {
    alias: 'timeout',
    describe: 'Timeout in seconds before process restarts',
    default: 0,
  })

  .option('u', {
    alias: 'user',
    describe: 'User who runs the process',
    default: 'root',
  })

  .option('wants', {
    default: 'network-online.target',
    describe: '[choices: see: systemctl list-units --type target --all]'
  })

  .option('wantedby', {
    default: 'multi-user.target',
    choices: [
      'multi-user.target',
      'graphical.target',
      'rescue.target',
      'reboot.target',
      'poweroff.target',
    ],
  })

  .help('h')
  .alias('h', 'help')

  .example(
`GENERATE

    From your projects root directory:
    sudo jsctl generate

    By telling jsctl where to find your pacakge.json:
    sudo jsctl generate -d /path/to/project

    Br by providing name and scriptpath arguments:
    sudo jsctl generate -n example-app -s /path/to/script.js

    A more customized example:
    sudo jsctl generate -u $USER -e \'NODE_ENV=development NODE_PORT=3000\' --stdout journal+console

GENERAL

    If you want to manage a service and you are not in its projects root folder,
    you have to provide the name:

    sudo jsctl stop -n example-app
    jsctl cat -n example-app`
  )

  .demandCommand()

  .argv
