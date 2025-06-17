const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

const generateControllerFile = async (controllerName) => {
    const json = path.join(__dirname, '..', 'ProjectInitiator', 'config.json');
    const content = await fs.readFile(json, 'utf8');
    const config = JSON.parse(content);
    
    let is_configure = config['has_Setup'];
    
    if (is_configure) {
        if (!controllerName) {
            console.error(`[X]------- Please provide a controller name.`);
            return;
        }

        const filename = `${controllerName}.js`;
        const root = path.join(__dirname, '..', '..');
        const controllerDir = path.join(root, 'controllers');
        const createFilePath = path.join(controllerDir, filename);

        let templateContent = '';

        try {
            const templatePath = path.join(__dirname, 'template.txt');
            templateContent = await fs.readFile(templatePath, 'utf8');
        }
        catch (error) {
            console.error(`${color.red}[X]------- Failed to read template file: ${error.message}${color.default_color}`);
            return;
        }

        try {
            await fs.mkdir(controllerDir, {recursive: true})
            await fs.writeFile(createFilePath, templateContent);
            console.log(`${color.green}[/]------- File created: ${filename} at ${createFilePath}${color.default_color}`);
        }
        catch (error) {
            console.error(`${color.red}[X]------- Error creating file: ${error.message}${color.default_color}`);
        }
    }
    else {
        console.log(`${color.red}[FAILED]------- ExpressiveJS haven't setup yet${color.default_color}`);
    }
};

const proxy_controller = async () => {
    const json = path.join(__dirname, '..', 'ProjectInitiator', 'config.json');
    const content = await fs.readFile(json, 'utf8');
    const config = JSON.parse(content);
    
    let is_configure = config['has_Setup'];
    
    if (is_configure) {
        if (!controllerName) {
            console.error(`[X]------- Please provide a controller name.`);
            return;
        }

        const filename = `${controllerName}.js`;
        const root = path.join(__dirname, '..', '..');
        const controllerDir = path.join(root, 'controllers');
        const createFilePath = path.join(controllerDir, filename);

        let templateContent = '';

        try {
            const templatePath = path.join(__dirname, 'proxy_controller_template.txt');
            templateContent = await fs.readFile(templatePath, 'utf8');
        }
        catch (error) {
            console.error(`${color.red}[X]------- Failed to read template file: ${error.message}${color.default_color}`);
            return;
        }

        try {
            await fs.mkdir(controllerDir, {recursive: true})
            await fs.writeFile(createFilePath, templateContent);
            console.log(`${color.green}[/]------- File created: ${filename} at ${createFilePath}${color.default_color}`);
        }
        catch (error) {
            console.error(`${color.red}[X]------- Error creating file: ${error.message}${color.default_color}`);
        }
    }
    else {
        console.log(`${color.red}[FAILED]------- ExpressiveJS haven't setup yet${color.default_color}`);
    }
};

module.exports = {generateControllerFile, proxy_controller};