# jsctl

A systemd cli for Node.js apps - similar to systemctl

With jsctl you can generate and manage service files like the following:

```
[Unit]
Description=example-app

[Service]
ExecStart=/path/to/node /path/to/project/index.js
WorkingDirectory=/path/to/project/
User=nobody
Restart=always
StandardOutput=syslog+console
StandardError=syslog+console
Environment=NODE_ENV=production NODE_PORT=3000

[Install]
WantedBy=multi-user.target
```

## Defaults

jsctl can use the name and main entries in your package.json and looks for your local Node.js installation.
By default the resulting service will automatically restart your application on failure and has NODE_ENV=production set as an environment variable. Of course these defaults can be overridden.

## Installation

```bash
$ yarn global add jsctl
$ # or
$ npm i -g jsctl
```

## Usage

```bash
$ cd path/to/example-app
$ sudo jsctl add -u $USER -e 'NODE_ENV=production NODE_PORT=3000'
created example-app
$ jsctl status
● example-app.jsctl.service - example-app
   Loaded: loaded (/etc/systemd/system/example-app.jsctl.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
$ sudo jsctl start
$ sudo jsctl enable
Created symlink from /etc/systemd/system/multi-user.target.wants/example-app.jsctl.service to /etc/systemd/system/example-app.jsctl.service.
$ cd /some/random/path
$ jsctl list
example-app
$ jsctl cat example-app
# /etc/systemd/system/example-app.jsctl.service
[Unit]
;After=
;AllowIsolate=
;Before=
;BindsTo=
;Conflicts=
DefaultDependencies=true
;Description=
;Documentation=
;IgnoreOnIsolate=
;JobTimeoutAction=
;JobTimeoutRebootArgument=
JobTimeoutSec=infinity
;JoinsNamespaceOf=
;OnFailure=
OnFailureJobMode=replace
;PartOf=
;PropagatesReloadFrom=
;PropagatesReloadTo=
;RebootArgument=
;RefuseManualStart=
;RefuseManualStop=
;Requires=
;RequiresMountsFor=
;Requisite=
StartLimitAction=none
;StartLimitBurst=
;StartLimitIntervalSec=
;StopWhenUnneeded=
;Wants=

[Service]
;BusName=
Environment=NODE_ENV=production NODE_PORT=3000
;ExecReload=
ExecStart=/usr/local/bin/node /home/user/path/to/example-app/index.js
;ExecStartPre=
;ExecStartPost=
;ExecStop=
;ExecStopPost=
;FailureAction=
;FileDescriptorStoreMax=
GuessMainPID=yes
;NonBlocking=
;NotifyAccess=
;PermissionsStartOnly=
;PIDFile=
;RemainAfterExit=
Restart=always
;RestartForceExitStatus=
;RestartPreventExitStatus=
RestartSec=100ms
;RootDirectoryStartOnly=
;RuntimeMaxSec=
;Sockets=
StandardOutput=syslog
StandardError=syslog
;SuccessExitStatus=
TimeoutStartSec=90s
TimeoutStopSec=90s
Type=simple
;USBFunctionDescriptors=
;USBFunctionStrings=
User=user
;WatchdogSec=
WorkingDirectory=/home/user/path/to/example-app

[Install]
;Alias=
;Also=
;DefaultInstance=
;RequiredBy=
WantedBy=multi-user.target

$ jsctl --help
Usage: jsctl <command> [name] [options]

Commands:
  add                Generate a service file
  list               List services
  remove             Remove a service file
  cat                Display a service file
  daemon-reload      Reload the daemon
  disable            Disable a service
  enable             Enable a service
  is-active          See if active
  is-enabled         See if enabled
  is-failed          See if failed
  list-dependencies  List service dependencies
  reload             Reload a service
  reload-or-restart  Reload or restart service
  restart            Restart a service
  show               Show service properties
  start              Start a service
  status             See the status of a service
  stop               Stop a service

Options:
  --help, -h                  Show help                                [boolean]
  --version, -v               Show version number                      [boolean]
  --after                     After
  --alias                     Alias
  --allowisolate              AllowIsolate
  --also                      Also
  --before                    Before
  --bindsto                   BindsTo
  --busname                   BusName
  --conflicts                 Conflicts
  --defaultdependencies       DefaultDependencies                [default: true]
  --defaultinstance           DefaultInstance
  --description               Description
  --documentation             Documentation
  --environment, -e           Environment       [default: "NODE_ENV=production"]
  --execreload                ExecReload
  --execstart, -s             [default: /path/to/node
                              /path/to/package/json/main/script.js]
  --execstartpost             ExecStartPost
  --execstartpre              ExecStartPre
  --execstop                  ExecStop
  --execstoppost              ExecStopPost
  --failureaction             FailureAction
  --filedescriptorstoremax    FileDescriptorStoreMax
  --guessmainpid              GuessMainPID                      [default: "yes"]
  --ignoreonisolate           IgnoreOnIsolate
  --jobtimeoutaction          JobTimeoutAction
  --jobtimeoutrebootargument  JobTimeoutRebootArgument
  --jobtimeoutsec             JobTimeoutSec                [default: "infinity"]
  --joinsnamespaceof          JoinsNamespaceOf
  --nonblocking               NonBlocking
  --notifyaccess              NotifyAccess
  --onfailure                 OnFailure
  --onfailurejobmode          OnFailureJobMode
        [choices: "fail", "replace", "replace-irreversibly", "isolate", "flush",
              "ignore-dependencies", "ignore-requirements"] [default: "replace"]
  --pidfile                   PIDFile
  --partof                    PartOf
  --permissionsstartonly      PermissionsStartOnly
  --propagatesreloadfrom      PropagatesReloadFrom
  --propagatesreloadto        PropagatesReloadTo
  --rebootargument            RebootArgument
  --refusemanualstart         RefuseManualStart
  --refusemanualstop          RefuseManualStop
  --remainafterexit           RemainAfterExit
  --requiredby                RequiredBy
  --requires                  Requires
  --requiresmountsfor         RequiresMountsFor
  --requisite                 Requisite
  --restart                   Restart
            [choices: "always", "no", "on-success", "on-failure", "on-abnormal",
                                  "on-abort", "on-watchdog"] [default: "always"]
  --restartforceexitstatus    RestartForceExitStatus
  --restartpreventexitstatus  RestartPreventExitStatus
  --restartsec                RestartSec                      [default: "100ms"]
  --rootdirectorystartonly    RootDirectoryStartOnly
  --runtimemaxsec             RuntimeMaxSec
  --sockets                   Sockets
  --standarderror             StandardError
                [choices: "inherit", "null", "tty", "journal", "syslog", "kmsg",
        "journal+console", "syslog+console", "kmsg+console", "socket"] [default:
                                                                       "syslog"]
  --standardoutput            StandardOutput
                [choices: "inherit", "null", "tty", "journal", "syslog", "kmsg",
        "journal+console", "syslog+console", "kmsg+console", "socket"] [default:
                                                                       "syslog"]
  --startlimitaction          StartLimitAction
           [choices: "none", "poweroff", "poweroff-force", "poweroff-immediate",
                 "reboot", "reboot-force", "reboot-immediate"] [default: "none"]
  --startlimitburst           StartLimitBurst
  --startlimitintervalsec     StartLimitIntervalSec
  --stopwhenunneeded          StopWhenUnneeded
  --successexitstatus         SuccessExitStatus
  --timeoutstartsec           TimeoutStartSec                   [default: "90s"]
  --timeoutstopsec            TimeoutStopSec                    [default: "90s"]
  --type                      Type
   [choices: "dbus", "forking", "idle", "notify", "oneshot", "simple"] [default:
                                                                       "simple"]
  --usbfunctiondescriptors    USBFunctionDescriptors
  --usbfunctionstrings        USBFunctionStrings
  --user, -u                  User                             [default: "root"]
  --wantedby                  WantedBy
             [choices: "multi-user.target", "graphical.target", "rescue.target",
              "reboot.target", "poweroff.target"] [default: "multi-user.target"]
  --wants                     Wants
  --watchdogsec               WatchdogSec
  --workingdirectory          /current/working/directory
  --assertions                comma seperated list of assertions
  --conditions                comma seperated list of conditions

Examples:
  ADD

  From your projects root directory:
  sudo jsctl add
  sudo jsctl add -u $USER -e 'NODE_ENV=development NODE_PORT=3000'

  By providing a name and --execstart:
  sudo jsctl add example-app -s '/usr/local/bin/node /path/to/script.js'

  GENERAL

  If you want to manage a service and you are not in its projects root folder,
  you have to provide its name:

  sudo jsctl stop example-app
  jsctl cat example-app
```

## License

MIT
