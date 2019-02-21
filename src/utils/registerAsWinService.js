/* eslint-disable no-undef */
const { Service } = require('node-windows'),
    path = require('path');

let svc = new Service({
    'name': 'Hussein Linker',
    'description': 'Hussein Nodejs application for Saving Links',
    'script': path.resolve(__dirname, '../', 'server', 'app.js')
});

svc.on('install', () => {
    svc.start();
});
svc.on('start', () => {
    console.log('service has started');
});
svc.on('error', (err) => {
    console.log(err);
});
svc.on('alreadyinstalled', () => {
    console.log('service already installed');
});
svc.on('uninstall', () => {
    console.log('service has uninstalled');
});
svc.uninstall();

