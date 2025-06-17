const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

const files = [
    ['rawUUID.txt', 'applications/UUID-generator.js'],
    ['rawfetch.txt', 'applications/http/fetch.js'],
    ['rawAxios.txt', 'applications/http/axios.js'],
    ['raw_proxy_App.txt', 'proxy_App.js'],
    ['raw_proxy_DotENV.txt', '.env'],
    ['raw_proxy_GitIgnore.txt', '.gitignore'],
    ['rawREADME.txt', 'README.md'],
    ['rawAPI_AUTH.txt', 'middlewares/API_Auth.js'],
    ['rawLimiter.txt', 'middlewares/express-rate-limit.js'],
    ['rawTokenGenerator.txt', 'applications/token-generator.js'],
    ['rawHeaderChecker.txt', 'middlewares/headers.js'],
    ['rawRegex.txt', 'applications/regex.js'],
    ['raw_proxy_NODEMON.txt', 'nodemon.json'],
    ['raw_new_expressive_cli.txt', 'expressivecli']
];


const createProxyAppFiles = async () => {
    const projectRoot = path.join(__dirname, '..', '..');

    for (const [template, respective_Directory] of files) {
        const template_file = path.join(__dirname, 'templates', template);
        const directory = path.join(projectRoot, respective_Directory);

        try {
            const content = await fs.readFile(template_file, 'utf8');
            await fs.writeFile(directory, content);   
        }
        catch (error) {
            console.error(`${color.red}[X]------- Failed to create ${directory}: ${error.message}${color.default_color}`);
        }
    }
};

module.exports = createProxyAppFiles;