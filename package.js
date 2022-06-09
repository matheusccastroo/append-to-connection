Package.describe({
  name: 'matheusccastro:append-to-connection',
  version: '1.0.2',
  summary: 'Easily append additional data to your DDP connection object.',
  git: 'https://github.com/matheusccastroo/append-to-connection',
  documentation: 'README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('2.7.3');
  api.use('ecmascript');
  api.use('reactive-var');
  api.use('tracker');

  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});
