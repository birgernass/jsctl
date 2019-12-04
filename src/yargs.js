const paths = require('./paths')
const service = require('./service')

module.exports = require('yargs')
  /**
   * general settings
   */
  .usage('Usage: jsctl <command> [name] [options]')
  .help('help')
  .alias('help', 'h')
  .version(() => require(paths.THIS_PACKAGE).version)
  .alias('version', 'v')
  .demandCommand()
  .strict()
  .example(
`ADD

  From your projects root directory:
  sudo jsctl add
  sudo jsctl add -u $USER -e 'NODE_ENV=development NODE_PORT=3000'

  By providing a name and --execstart:
  sudo jsctl add example-app -s '/usr/local/bin/node /path/to/script.js'

GENERAL

  If you want to manage a service and you are not in its projects root folder,
  you have to provide its name:

  sudo jsctl stop example-app
  jsctl cat example-app`
  )
  /**
   * custom commands
   */
  .command('add', 'Generate a service file in /etc/systemd/system')
  .command('gen', 'Generate a service file in current working directory')
  .command('list', 'List services')
  .command('remove', 'Remove a service file')
  /**
   * systemctl commands
   */
  .command('cat', 'Display a service file')
  .command('daemon-reload', 'Reload the daemon')
  .command('disable', 'Disable a service')
  .command('enable', 'Enable a service')
  .command('is-active', 'See if active')
  .command('is-enabled', 'See if enabled')
  .command('is-failed', 'See if failed')
  .command('list-dependencies', 'List service dependencies')
  .command('reload', 'Reload a service')
  .command('reload-or-restart', 'Reload or restart service')
  .command('restart', 'Restart a service')
  .command('show', 'Show service properties')
  .command('start', 'Start a service')
  .command('status', 'See the status of a service')
  .command('stop', 'Stop a service')
  /**
   * options
   */
  .options(
  service.options.sort().reduce(
    (prev, curr) => Object.assign(
      {},
      prev,
      {
        [curr.toLowerCase()]: {
          describe: curr
        }
      }
    ),
    {}
  )
  )
  .option('assertions', { describe: 'comma seperated list of assertions' })
  .option('conditions', { describe: 'comma seperated list of conditions' })
  .default('defaultdependencies', true)
  .alias('environment', 'e')
  .default('environment', 'NODE_ENV=production')
  .option('execstart', {
    describe: '[default: /path/to/node /path/to/package/json/main/script.js]',
  })
  .alias('execstart', 's')
  .default('guessmainpid', 'yes')
  .default('jobtimeoutsec', 'infinity')
  .default('onfailurejobmode', 'replace')
  .choices('onfailurejobmode', [
    'fail',
    'replace',
    'replace-irreversibly',
    'isolate',
    'flush',
    'ignore-dependencies',
    'ignore-requirements',
  ])
  .default('restart', 'always')
  .choices('restart', [
    'always',
    'no',
    'on-success',
    'on-failure',
    'on-abnormal',
    'on-abort',
    'on-watchdog',
  ])
  .default('restartsec', '100ms')
  .default('startlimitaction', 'none')
  .choices('startlimitaction', [
    'none',
    'poweroff',
    'poweroff-force',
    'poweroff-immediate',
    'reboot',
    'reboot-force',
    'reboot-immediate',
  ])
  .default('standardoutput', 'syslog')
  .choices('standardoutput', [
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
  ])
  .default('standarderror', 'syslog')
  .choices('standarderror', [
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
  ])
  .default('timeoutstartsec', '90s')
  .default('timeoutstopsec', '90s')
  .default('type', 'simple')
  .choices('type', [
    'dbus',
    'forking',
    'idle',
    'notify',
    'oneshot',
    'simple',
  ])
  .default('user', 'root')
  .alias('user', 'u')
  .alias('workingdirectory', 'cwd')
  .option('workingdirectory', {
    describe: '/current/working/directory',
  })
  .default('wantedby', 'multi-user.target')
  .choices('wantedby', [
    'multi-user.target',
    'graphical.target',
    'rescue.target',
    'reboot.target',
    'poweroff.target',
  ])
  .argv
