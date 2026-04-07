const { spawn } = require('child_process');
const color_code = require('../colorCode/ANSI');

function installDependencies(deps, isDev = false) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(deps)) {
            return reject(new Error('Dependencies must be an array'));
        }

        const args = ['install', ...deps];
        if (isDev) args.push('--save-dev');

        const child = spawn('npm', args, { stdio: 'inherit', shell:true });

        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`${color_code.red}[ERROR] Install failed${color_code.default_color}`);
                reject(new Error(`Exit code ${code}`));
            } else {
                console.log(`${color_code.green}[SUCCESS] Install complete${color_code.default_color}`);
                resolve();
            }
        });
    });
}

function uninstallDependencies(deps, isDev = false) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(deps)) {
            return reject(new Error('Dependencies must be an array'));
        }

        const args = ['uninstall', ...deps];
        if (isDev) args.push('--save-dev');

        const child = spawn('npm', args, { stdio: 'inherit', shell:true });

        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`${color_code.red}[ERROR] Install failed${color_code.default_color}`);
                reject(new Error(`Exit code ${code}`));
            } else {
                console.log(`${color_code.green}[SUCCESS] Install complete${color_code.default_color}`);
                resolve();
            }
        });
    });
}

/**
 * 
 * @param {Array<String>} deps - list of dependences from setup.json 
 */
exports.install = async (deps) => {
    try {
        console.log(`\nDependencies list:`);
        deps.forEach(d => console.log(d));
        console.log();
        await installDependencies(deps);
        await installDependencies(['nodemon'], true);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

exports.uninstall = async (deps) => {
    try {
        await uninstallDependencies(deps);
    }
    catch (error) {
        console.error(err);
        process.exit(1);
    }
}