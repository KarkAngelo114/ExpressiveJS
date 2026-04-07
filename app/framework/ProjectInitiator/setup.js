const { red, default_color, gray, yellow, green } = require("../colorCode/ANSI");
const { serve } = require("../serve_app/serveJS");
const { install } = require("../subprocess/dependencyInstaller");
const { input, rl } = require("./cli");
const { configure } = require("./config");
const config = require('./config.json');
const { createFolders } = require("./createFolders");
const { createFiles } = require("./fileCreator");

let baseUrl = "https://raw.githubusercontent.com/KarkAngelo114/ExpressiveJS/main";


/**
 * 
 * @param {String} flag1 - if "--setDatabase" is passed, refer to the flag2 the type of database. If flag1 is "--no-db", flag2 must be null
 * @param {String} flag2 - type of database management system (e.g. postgre)
 */
exports.Setup = async (flag1, flag2) => {
    try {
        const isAlreadtSetup = config['has_Setup'];

        if (isAlreadtSetup) {
            console.log(`${yellow}[INFO]------- Project already setup. Run "node expressivecli new" if starting a new project${default_color}`);
            process.exit(1);
        }

        console.log(`\n${yellow}------- ExpressiveJS Setup -------\n${default_color}`);
        console.log('Fetching data from repository...');

        //fetch setup.json
        const response = await fetch(`${baseUrl}/setup.json`);

        if (response.status === 404) throw new Error("Setup config not found. Either the JSON file is moved, renamed, changed, or deleted.");
        if (response.status === 500) throw new Error(`Failed to fetch setup.json. Status Code:${response.status}`);

        let byte = await response.headers.get('content-length');
        
        console.log(`Byte size: ${byte}B ${green} ✓ ${gray}[GET] ${baseUrl}/setup.json${default_color}`);
        const data = await response.json();

        const folders = flag1 === "--no-db" ? data.no_db_setup_folders : data.setup_folders;
        const files = flag1 === "--no-db" ? data.no_db_setup : data.setup;
        const dependencies = flag1 === "--no-db" ? data.no_db_deps : data.db_deps;

        console.log("Scaffolding project folder structure...");
        createFolders(folders);
        await delay(2500);
        
        console.log("Creating flles...");
        await createFiles(`${baseUrl}/src`,files, flag2 === "postgre" ? "postgre" : null);
        await delay(2500);

        console.log('Installing Dependencies...');
        await install(dependencies);
        await delay(2500);

        if (flag1 !== "--no-db") {
            console.log("Setting database...");
            const { onCreate } = require('../../database/MySQL/createDatabase');
            await onCreate();
            await delay(2500);
        }

        console.log("Finalizing...");
        await configure(flag1);
        await delay(2500);

        console.log(`${green}Setup complete...${default_color}\n`);
        console.log(`${yellow}------- Thank you for using ExpressiveJS -------\n${default_color}`);

        while(true) {
            const choice = await input("Do you want to start developement server? (press 'Y' to start, enter to any key to exit): ");

            switch(choice.toLowerCase()) {
                case "y":
                    serve();
                    break;
                default: 
                    rl.close();
                    process.exit(0);
            }
        }
        
    }
    catch (error) {
        console.error(`${red}\n[ERROR]------- Failed to setup${default_color}\n`);
        console.error(error);
        console.log(`\nIf this error occurred, please create an issue on ${gray}https://github.com/KarkAngelo114/ExpressiveJS/issues${default_color}` );
        process.exit(1);
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));