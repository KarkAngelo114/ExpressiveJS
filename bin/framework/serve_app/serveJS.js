const subprocess = require('child_process');
const color_code = require('../colorCode/ANSI');

const serve = () => {
    require('dotenv').config();
    let port = Number(process.env.PORT);
    console.log(`\n${color_code.yellow}Local Development server starting . . . ${color_code.default_color}`);
    console.log(`\n\n - - - - CTRL + C to stop running\n`);
    console.log(`\nAccess your web app here: ${color_code.yellow}http://localhost:${port}/views${color_code.default_color}\n\n`);

    const childServe = subprocess.spawn('npx', ['nodemon'], {
        stdio: 'inherit',
        shell: true
    });

    childServe.on('error', (error) => {
        console.error(`${color_code.red}[ERROR]-------Failed to start the server: ${error.message}${color_code.default_color}`);
    });

    childServe.on('exit', (code) => {
        if (code === 0) {
            console.log(`${color_code.green}[SUCCESS]-----Server exited successfully${color_code.default_color}`);
        } else {
            console.error(`${color_code.red}[ERROR]-------Server exited with code ${code}${color_code.default_color}`);
        }
    });

    // // run the App.js
    // const child = subprocess.spawn('node', ['App.js'], {
    //     stdio: 'inherit',
    //     shell: true
    // });

    // child.on('error', (error) => {
    //     console.error(`${color_code.red}[ERROR]-------Failed to start the server: ${error.message}${color_code.default_color}`);
    // });

    // child.on('exit', (code) => {
    //     if (code === 0) {
    //         console.log(`${color_code.green}[SUCCESS]-----Server exited successfully${color_code.default_color}`);
    //     } else {
    //         console.error(`${color_code.red}[ERROR]-------Server exited with code ${code}${color_code.default_color}`);
    //     }
    // });
};

module.exports = {
    serve
};
