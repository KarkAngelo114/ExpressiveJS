// framework/entry.js

const color = require('./colorCode/ANSI');
const config = require('./ProjectInitiator/config.json');
const createMigrationFile = require('./migrationGenerator/migrationFileGenerator');
const { generateControllerFile, no_db_controller } = require('./controllerGenerator/controllerGenerator');
const createModel = require('./modelGenerator/modelFileGenerator');
const generateRouteFile = require('./routerGenerator/routeFileGenerator');
const generateWorker = require('./workerGenerator/generateWorker');
const { resetConfig, getVersion } = require('./ProjectInitiator/config');
const { serve } = require('./serve_app/serveJS');
const { initiateUpdate, checkUpdate } = require('./ProjectInitiator/updater');
const { Setup } = require('./ProjectInitiator/setup');

exports.runCLI = async (args) => {
    const arg1 = args[0]?.toLowerCase();
    const arg2 = args[1]?.toLowerCase();
    const arg3 = args[2]?.toLowerCase();

    const commandsName = {
        "generate-migration <name>": "Generate a migration file",
        "generate-model <name>": "Generate a model file",
        "generate-controller <name>": "Generate a controller file",
        "generate-route <name>": "Generate a route file",
        "generate-worker <name>": "Generate a worker file",
        "initiate-setup": "Initialize project",
        "initiate-setup --no-db": "Setup project without DB",
        "initiate-setup --setDatabase <db>": "Setup with specific DB (e.g. postgre)",
        "--serve": "Start the app",
        "new": "Reset configuration",
        "--help": "Show available commands",
        "-v":"Get current version",
        "check-update":"Check for update",
        "update":"Update scaffolded modules",
        "update --force":"Update all scaffolded modules without checking 'Updatable' exported property of every files. (Be cautious when using this flag especially if there are modifications on scaffolded files)"
    };

    if (arg1 === "--help") {
        console.log(`\n${color.yellow}============ expressiveCLI commands ============${color.default_color}\n`);
        for (const cmd in commandsName) {
            console.log(`${color.yellow}${cmd}${color.default_color} - ${commandsName[cmd]}`);
        }
        process.exit(0);
    }

    switch (arg1) {
        case "generate-model":
            if (!config['has-db']) {
                console.log(`${color.yellow}[INFO]------- Cannot create a model file.${color.default_color}`);
                return;
            }
            await createModel(arg2);
            break;

        case "generate-migration":
            if (!config['has-db']) {
                console.log(`${color.yellow}[INFO]------- Cannot create a migration file.${color.default_color}`);
                return;
            }

            await createMigrationFile(arg2);
            break;

        case "generate-controller":

            config['has-db'] ? await generateControllerFile(arg2) : await no_db_controller(arg2);
            break;

        case "generate-route":
            await generateRouteFile(arg2);
            break;

        case "generate-worker":
            await generateWorker(arg2);
            break;

        case "initiate-setup":
            await Setup(arg2, arg3);
            break;

        case "--serve":
            serve();
            break;

        case "new":
            await resetConfig();
            break;

        case "update":
            await initiateUpdate(arg2);
            break;

        case "check-update":
            await checkUpdate();
            break;

        case "-v":
            await getVersion();
            process.exit(0);

        default:
            console.log(`${color.yellow}[!] Unknown command "${arg1}".${color.default_color}`);
            console.log(`${color.yellow}[!] Type "expressivecli --help" for available commands.${color.default_color}`);
            process.exit(0);
    }
}