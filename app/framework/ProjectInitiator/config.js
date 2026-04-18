const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

exports.configure = async (setup) => {
    try {
        const json = path.join(__dirname, 'config.json');
        const content = await fs.readFile(json, 'utf8');
        let config = JSON.parse(content);
        config['has_Setup'] = true;
        config['has-db'] = setup === "--no-db" ? false : true;
        await fs.writeFile(json, JSON.stringify(config, null, 4), 'utf-8');
    }
    catch (error) {
        console.error(`${color.red}[FAILED]-------Failed to configure: ${error}${color.default_color}`);
    }
    try {
        const packageJSON = path.join(__dirname, '..', '..', 'package.json');
        const pkgContent = await fs.readFile(packageJSON, 'utf8');
        let pkg = JSON.parse(pkgContent);

        pkg.scripts = {
            ...pkg.scripts,
            "dev":"node expressivecli --serve",
            "start": "node App.js",
            "dev": "nodemon App.js",
            "build": "npm install"
        };
        pkg._note = "Please remove the (dev) attribute from the scripts section before deploying to production.";

        await fs.writeFile(packageJSON, JSON.stringify(pkg, null, 4), 'utf-8');
    }
    catch (error) {
        console.error(`${color.red}[FAILED]-------Failed to update package.json: ${error}${color.default_color}`);
    }
};

exports.resetConfig = async () => {
    try {
        const json = path.join(__dirname, 'config.json');
        const content = await fs.readFile(json, 'utf8');
        let config = JSON.parse(content);
        config['has_Setup'] = false;
        await fs.writeFile(json, JSON.stringify(config, null, 4), 'utf-8');

        // delete the lock file

        const lock_file = path.join(__dirname, 'expressivejs-lock.json');
        await fs.unlink(lock_file);

        console.log(`${color.yellow}[INFO]-------Configuration reset. ${color.default_color}`);
        process.exit(1);
    }
    catch (error) {
        console.error(`${color.red}[FAILED]-------Failed to configure: ${error}${color.default_color}`);
    }
};

exports.updateVersion = async (version) => {
    const json = path.join(__dirname, 'config.json');
    const content = await fs.readFile(json, 'utf8');
    let config = JSON.parse(content);
    config['version'] = version;
    await fs.writeFile(json, JSON.stringify(config, null, 4), 'utf-8');
};

exports.getVersion = async () => {
    console.log(`Copyright © ${new Date().getFullYear()} all right's reserved`);
    console.log('Version:',JSON.parse(await fs.readFile(path.join(__dirname, 'config.json')))['version']);
    console.log("License: MIT");
};