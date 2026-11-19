// This is the file watcher mechanism.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const hasSetup = require('../ProjectInitiator/config.json')['has_Setup'];

let server;
let restartTimer;

function startServer() {

    if (!hasSetup) return;

    server = spawn('node', ['App.js'], {
        stdio: 'inherit'
    });
}

function restartServer(filename) {
    console.log(`Changes detected in ${filename}. Restarting...`);

    if (server) {
        server.kill();
    }

    startServer();
}


if (hasSetup) {
    const ignoredDirectories = new Set([
        '.git',
        'node_modules',
        'uploads',
        'framework'
    ]);

    fs.watch('./', { recursive: true }, (_, filename) => {
        if (!filename) return;

        const changedPath = filename.toString();
        const pathParts = changedPath.split(/[\\/]+/);
        if (pathParts.some(part => ignoredDirectories.has(part.toLowerCase()))) return;

        clearTimeout(restartTimer);
        restartTimer = setTimeout(() => {
            restartServer(pathParts.join(path.sep));
        }, 2000);
    });
}


process.on('SIGINT', () => {
    console.log('\nStopping development server...');

    clearTimeout(restartTimer);
    if (server) {
        server.kill('SIGTERM');
    }

    process.exit(0);
});


module.exports = {
    startServer
};