const { createFolders } = require('./createFolders');
const { createFiles } = require('./fileCreator');
const createProxyAppFolders = require('./proxyAppFolders');
const createProxyAppFiles = require('./proxyAppFiles');
const { install, proxy_dependencies } = require('../subprocess/dependencyInstaller');
const { configure, proxyAppconfigure } = require('./config');
const color_code = require('../colorCode/ANSI');
const fs = require('fs').promises;
const path = require('path');


/**
 * 
 * once init() is executed, the project will setup as a full fledge backend server application
 * 
 * 
 */
const init = async (value) => {
    const json = path.join(__dirname, 'config.json');
    const content = await fs.readFile(json, 'utf8');
    const config = JSON.parse(content);

    let is_configure = config['has_Setup'];

    if (!is_configure) {
        console.log(`\n${color_code.yellow}============${color_code.default_color} ExpressiveJS Setup ${color_code.yellow}============${color_code.default_color}\n`);
        console.log("[TASK]-------Please wait while we set up...");

        await delay(2000);
        console.log("[TASK]-------Generating files...");
        createFolders();

        await delay(2000);
        createFiles(value);

        await delay(2000);
        console.log("[TASK]-------Installing dependencies...");

        try {
            await install();
            console.log("[TASK]-------Setting Database...");
            const { onCreate } = require('../../database/MySQL/createDatabase');
            await onCreate();
            

        } catch (err) {
            console.error(`${color_code.red}[X] Error during setup: ${err.message}${color_code.default_color}`);
        }

        await delay(2000);
        console.log("[TASK]-------Finalizing...");
        configure();

        await delay(1000);
        console.log(`${color_code.green}[SUCCESS]-----ExpressiveJS setup completed successfully!${color_code.default_color}\n`);
        console.log(`${color_code.yellow} -- Type "node expressiveCLI --help" for more commands.${color_code.default_color}\n`);
        console.log("- - - Thank you for using ExpressiveJS! - - -\n");
    }
    else {
        console.log(`\n${color_code.yellow}[INFO]-------Project already setup${color_code.default_color}`);
    }
    
    
};

/**
 * 
 * this function will initiate a proxy server application. Once the setup complete, the application is not as same as a full fledge backend server
 * application with database connections.
 * 
 * 
 */

const proxy_setup = async () => {
    const json = path.join(__dirname, 'config.json');
    const content = await fs.readFile(json, 'utf8');
    const config = JSON.parse(content);

    let is_configure = config['has_Setup'];

    if (!is_configure) {
        console.log(`\n${color_code.yellow}============${color_code.default_color} ExpressiveJS Setup (proxy) ${color_code.yellow}============${color_code.default_color}\n`);
        console.log("[TASK]-------Please wait while we set up...");

        await delay(2000);
        console.log("[TASK]-------Generating files...");
        createProxyAppFolders();

        await delay(2000);
        createProxyAppFiles();

        await delay(2000);
        console.log("[TASK]-------Installing dependencies...");

        try {
            await delay(2000);
            await proxy_dependencies();
        }
        catch (err) {
            console.error(`${color_code.red}[X] Error during setup: ${err.message}${color_code.default_color}`);
        }

        await delay(2000);
        console.log("[TASK]-------Finalizing...");
        proxyAppconfigure();

        await delay(1000);
        console.log(`${color_code.green}[SUCCESS]-----ExpressiveJS setup completed successfully!${color_code.default_color}\n`);
        console.log(`${color_code.yellow} -- Type "node expressiveCLI --help" for more commands.${color_code.default_color}\n`);
        console.log("- - - Thank you for using ExpressiveJS! - - -\n");
    }
    else {
        console.log(`\n${color_code.yellow}[INFO]-------Project already setup${color_code.default_color}`);
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    init,
    proxy_setup,
};
