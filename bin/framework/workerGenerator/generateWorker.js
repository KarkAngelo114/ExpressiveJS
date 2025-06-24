const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

const generateWorker = async (filename) => {

    const json = path.join(__dirname, '..', 'ProjectInitiator', 'config.json');
    const content = await fs.readFile(json, 'utf8');
    const config = JSON.parse(content);

    let is_configure = config['has_Setup'];

    if (is_configure) {
        if (!filename) {
            console.error(`${color.red}[X]------ Please provide a the worker name`);
            return;
        }

        const workerFile = path.join(__dirname, '..', '..', `applications/server-workers/${filename}.js`);

        let content = '';

        try {
            const templatePath = path.join(__dirname, 'template.txt');
            content = await fs.readFile(templatePath, 'utf8');
        }
        catch (error) {
            console.error(`${color.red}[X]------ Failed to read template file: ${error.message}${color.default_color}`);
            return;
        }
        try {
            await fs.writeFile(workerFile, content, 'utf8');
            console.log(`${color.green}[✓]------ Worker file created successfully at ${workerFile}${color.default_color}`);
        }
        catch  (error) {
            console.error(`${color.red}[X]------ Error creating file: ${error.message}${color.default_color}`);
            return;
        }
    }
    else {
        console.log(`${color.red}[FAILED]------ ExpressiveJS haven't setup yet${color.default_color}`);
        return;
    }
};

module.exports = generateWorker;