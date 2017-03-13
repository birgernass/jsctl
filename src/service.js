const options = {
  unit: [
    'After',
    'AllowIsolate',
    'Before',
    'BindsTo',
    'Conflicts',
    'DefaultDependencies',
    'Description',
    'Documentation',
    'IgnoreOnIsolate',
    'JobTimeoutAction',
    'JobTimeoutRebootArgument',
    'JobTimeoutSec',
    'JoinsNamespaceOf',
    'OnFailure',
    'OnFailureJobMode',
    'PartOf',
    'PropagatesReloadFrom',
    'PropagatesReloadTo',
    'RebootArgument',
    'RefuseManualStart',
    'RefuseManualStop',
    'Requires',
    'RequiresMountsFor',
    'Requisite',
    'StartLimitAction',
    'StartLimitBurst',
    'StartLimitIntervalSec',
    'StopWhenUnneeded',
    'Wants',
  ],

  service: [
    'BusName',
    'Environment',
    'ExecReload',
    'ExecStart',
    'ExecStartPre',
    'ExecStartPost',
    'ExecStop',
    'ExecStopPost',
    'FailureAction',
    'FileDescriptorStoreMax',
    'GuessMainPID',
    'NonBlocking',
    'NotifyAccess',
    'PermissionsStartOnly',
    'PIDFile',
    'RemainAfterExit',
    'Restart',
    'RestartForceExitStatus',
    'RestartPreventExitStatus',
    'RestartSec',
    'RootDirectoryStartOnly',
    'RuntimeMaxSec',
    'Sockets',
    'StandardOutput',
    'StandardError',
    'SuccessExitStatus',
    'TimeoutStartSec',
    'TimeoutStopSec',
    'Type',
    'USBFunctionDescriptors',
    'USBFunctionStrings',
    'User',
    'WatchdogSec',
    'WorkingDirectory',
  ],

  install: [
    'Alias',
    'Also',
    'DefaultInstance',
    'RequiredBy',
    'WantedBy',
  ],
}

const commentIfUnset = param => param ? '' : ';'

const optionToRow = (argv, opt) => `${commentIfUnset(argv[opt.toLowerCase()])}${opt}=${argv[opt.toLowerCase()] || ''}`

const optionsToRows = (argv, opts) => opts.map(opt => optionToRow(argv, opt)).join('\n')

const generate = argv => `[Unit]
${optionsToRows(argv, options.unit)}
${argv.assertions ? argv.assertions.replace(',', '\n') : ''}
${argv.conditions ? argv.conditions.replace(',', '\n') : ''}

[Service]
${optionsToRows(argv, options.service)}

[Install]
${optionsToRows(argv, options.install)}
`

module.exports = {
  generate,
  options: [
    ...options.install,
    ...options.service,
    ...options.unit,
  ],
}
