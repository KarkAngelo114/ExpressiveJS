const color_code = require('../colorCode/ANSI');
const startServer = require("./dev");
require('dotenv').config();

exports.serve = () => {
    
    process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
    console.clear();
    let port = Number(process.env.PORT);
    console.log(`\n${color_code.yellow}Local Development server starting on port ${port}. . . ${color_code.default_color}`);
    console.log(`\n\n - - - - CTRL + C to stop running\n`);
    console.log(`\nAccess your web app here: ${color_code.yellow}http://localhost:${port}/views${color_code.default_color}\n\n`);

    startServer();    
};
