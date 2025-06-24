const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

// create folders
const createFolders = async () => {

    const folders = [
        'applications/server-workers',
        'controllers',
        'database/MySQL/',
        'middlewares',
        'models',
        'routes',
        'sessions',
        'uploads',
        'views',
    ];

    try {
        for (let i = 0; i < folders.length; i++) {
            const folderPath = path.join(__dirname, '..', '..', folders[i]);
            await fs.mkdir(folderPath, { recursive: true });
        }
    }
    catch (error) {
        console.error(`${color.red}[X]------- Failed to initiate setup: ${error.message}${color.default_color}`);
        return;
    }
}

module.exports = {createFolders};