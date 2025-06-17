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
        console.error(`${color.red}[FAILED]-------Failed to configure: ${error}${color.default_color}`);
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
        console.error(`${color.red}[FAILED]-------Failed to update package.json: ${error}${color.default_color}`);
    }
};

const proxyAppconfigure = async () => {
    try {
        const json = path.join(__dirname, 'config.json');
        const content = await fs.readFile(json, 'utf8');
        let config = JSON.parse(content);
        config['has_Setup'] = true;
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
            "start": "node proxy_App.js",
            "dev": "nodemon proxy_App.js",
            "build": "npm install"
        };
        pkg._note = "Please remove the (dev) attribute from the scripts section before deploying to production.";

        await fs.writeFile(packageJSON, JSON.stringify(pkg, null, 4), 'utf-8');
    }
    catch (error) {
        console.error(`${color.red}[FAILED]-------Failed to update package.json${color.default_color}\n${error}`);
    }
}

const resetConfig = async () => {
    try {
        const json = path.join(__dirname, 'config.json');
        const content = await fs.readFile(json, 'utf8');
        let config = JSON.parse(content);
        config['has_Setup'] = false;
        await fs.writeFile(json, JSON.stringify(config, null, 4), 'utf-8');

        console.log(`${color.yellow}[INFO]-------Configuration reset. ${color.default_color}`);
    }
    catch (error) {
        console.error(`${color.red}[FAILED]-------Failed to configure: ${error}${color.default_color}`);
    }
};

module.exports = { configure, proxyAppconfigure, resetConfig };