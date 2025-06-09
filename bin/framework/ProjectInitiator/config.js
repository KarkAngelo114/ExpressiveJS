const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

const configure = async () => {
    try {
        const json = path.join(__dirname, 'config.json');
        const content = await fs.readFile(json, 'utf8');
        let config = JSON.parse(content);
        config['has_Setup'] = true;
        await fs.writeFile(json, JSON.stringify(config, null, 4), 'utf-8');
    }
    catch (error) {
        console.error(`${color.red}[FAILED]-------Failed to configure`);
    }
    try {
        const packageJSON = path.join(__dirname, '..', '..', 'package.json');
        const pkgContent = await fs.readFile(packageJSON, 'utf8');
        let pkg = JSON.parse(pkgContent);

        pkg.scripts = {
            ...pkg.scripts,
            "start": "node App.js",
            "dev": "nodemon App.js",
            "build": "npm install"
        };
        pkg._note = "Please remove the (dev) attribute from the scripts section before deploying to production.";

        await fs.writeFile(packageJSON, JSON.stringify(pkg, null, 4), 'utf-8');
    }
    catch (error) {
        console.error(`${color.red}[FAILED]-------Failed to update package.json`);
    }
};

module.exports = { configure };