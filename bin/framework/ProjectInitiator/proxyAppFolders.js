const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

const createProxyAppFolders = async () => {
    const folders = [
        'applications/http',
        'controllers',
        'middlewares',
        'routes'
    ];

    try {
        for (let i = 0; i < folders.length; i++) {
            const project_folders = path.join(__dirname, '..', '..',  folders[i]);
            await fs.mkdir(project_folders, {recursive:true});
        }
    }
    catch (error) {
        console.error(`${color.red}[X]------- Failed to initiate setup: ${error.message}${color.default_color}`);
        return;
    } 
};

module.exports = createProxyAppFolders;