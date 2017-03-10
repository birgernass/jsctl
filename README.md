# jsctl

A systemd commandline tool for Node.js apps - similar to systemctl

jsctl generates service files like the following and lets you manage your generated services from the command line.

```
[Unit]
Description=Your description
Wants=network-online.target

[Service]
ExecStart=/path/to/node /path/to/project/index.js
WorkingDirectory=/path/to/project/
User=nobody
Restart=always
RestartSec=0
StandardOutput=syslog+console
StandardError=syslog+console
Environment=NODE_ENV=production NODE_PORT=3000

[Install]
WantedBy=multi-user.target
```

## Installation
```bash
$ yarn global add jsctl
$ # or
$ npm i -g jsctl
```

## Usage


```bash
$ cd path/to/example-app
$ sudo jsctl generate -user $USER -env 'NODE_ENV=production NODE_PORT=3000'
/etc/systemd/system/example-app.jsctl.service created
$ jsctl status
● example-app.jsctl.service - example-app
   Loaded: loaded (/etc/systemd/system/jsctl.jsctl.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
$ sudo jsctl start
Created symlink from /etc/systemd/system/multi-user.target.wants/example-app.jsctl.service to /etc/systemd/system/example-app.jsctl.service.
$ cd /some/random/path
$ jsctl list
example-app
$ sudo jsctl stop -n example-app
Removed symlink /etc/systemd/system/multi-user.target.wants/example-app.jsctl.service.
```

```bash
$ jsctl --help
Usage: jsctl <command> [options]

Commands:
  cat                Display a service file
  daemon-reload      Reload the daemon
  disable            Disable a service
  enable             Enable a service
  generate           Generate a service file
  is-active          See if active
  is-enabled         See if enabled
  is-failed          See if failed
  list               List service files
  list-dependencies  Reload a service
  reload             Reload a service
  reload-or-restart  Reload or restart service
  remove             Remove a service file
  restart            Restart a service
  show               Show service properties
  start              Start a service
  status             See the status of a service
  stop               Stop a service
  test               Stop a service

Options:
  --custom          Custom [Service] options, e.g. --custom
                    'SuccessExitStatus=1\nType=simple'             [default: ""]
  -d, --directory   Path to project folder with package.json (default:
                    process.cwd())
                   [default: "/home/TECHYOO/bnass/projects/acr/feedback-webapp"]
  -e, --env         Evironment                  [default: "NODE_ENV=production"]
  -n, --name        Name of a generated service
  --nodepath        Path to node binary (default: process.argv[0])
                                                [default: "/usr/local/bin/node"]
  -s, --scriptpath  Path to your JavaScript file (default: main entry in
                    package.json)
  --stdout          StandardOut
                [choices: "inherit", "null", "tty", "journal", "syslog", "kmsg",
        "journal+console", "syslog+console", "kmsg+console", "socket"] [default:
                                                                       "syslog"]
  --stderr          StandardError
                [choices: "inherit", "null", "tty", "journal", "syslog", "kmsg",
        "journal+console", "syslog+console", "kmsg+console", "socket"] [default:
                                                                       "syslog"]
  -t, --timeout     Timeout in seconds before process restarts      [default: 0]
  -u, --user        User who runs the process                  [default: "root"]
  --wants           [choices: see: systemctl list-units --type target --all]
                                              [default: "network-online.target"]
  -h, --help        Show help                                          [boolean]
  --restart [choices: "no", "always", "on-success", "on-failure", "on-abnormal",
                                  "on-abort", "on-watchdog"] [default: "always"]
  --wantedby [choices: "multi-user.target", "graphical.target", "rescue.target",
              "reboot.target", "poweroff.target"] [default: "multi-user.target"]

Examples:
  GENERATE

  from your projects root directory:
  sudo jsctl generate -u $USER

  by telling jsctl where to find your pacakge.json:
  sudo jsctl generate -u $USER -d /path/to/project

  or by providing name and scriptpath arguments:
  sudo jsctl generate -u $USER -n example-app -s /path/to/script.js

  a more customized example:
  sudo jsctl generate -u nobody -e 'NODE_ENV=development NODE_PORT=3000'
  --stdout 'journal+console'

  GENERAL

  if you want to manage a service and you are not in its projects root folder,
  you have to provide the name:

  sudo jsctl stop -n example-app
  jsctl cat -n example-app
```

Local installation example:

```bash
$ yarn add jsctl
$ # or
$ npm i --save-dev jsctl
```

```js
// package.json
{
  "name": "example-app",                                // required
  "main": "path/to/script.js",                          // required
  "scripts": {
    "generate": "sudo ./node_modules/.bin/jsctl generate -u $USER",
    "start": "sudo ./node_modules/.bin/jsctl start",
    "status": "jsctl status",
    "stop": "sudo ./node_modules/.bin/jsctl stop"
  }
}
```

## License

MIT
