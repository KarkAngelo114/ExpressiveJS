// This is the file watcher mechanism.

const { spawn } = require('child_process');
const fs = require('fs');

let server;

function startServer() {
    server = spawn('node', ['App.js'], {
        stdio: 'inherit'
    });
}

function restartServer() {
    console.log('Changes detected. Restarting...');

    if (server) {
        server.kill();
    }

    startServer();
}



fs.watch(process.cwd(), { recursive: true }, (event, filename) => {
    if (filename) {
        restartServer();
    }
});

process.on('SIGINT', () => {
    console.log('\nStopping development server...');

    if (server) {
        server.kill('SIGTERM');
    }

    process.exit(0);
});


module.exports = startServer;