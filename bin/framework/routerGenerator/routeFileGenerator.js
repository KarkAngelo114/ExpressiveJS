const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

const generateRouteFile = async (routeName) => {
    const json = path.join(__dirname, '..', 'ProjectInitiator', 'config.json');
    const content = await fs.readFile(json, 'utf8');
    const config = JSON.parse(content);
        
    let is_configure = config['has_Setup'];
        
    if (is_configure) {
        if (!routeName) {
            console.error(`${color.red}[X]------- Please provide a route name. ${color.default_color}`);
            return;
        }

        const filename = `${routeName}.js`;
        const root = path.join(__dirname, '..', '..');
        const routeDir = path.join(root, 'routes');
        const createFilePath = path.join(routeDir, filename);

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
            await fs.mkdir(routeDir, { recursive: true });
            await fs.writeFile(createFilePath, templateContent);
            console.log(`${color.green}[/]------- File created: ${filename} at ${createFilePath}${color.default_color}`);
        }
        catch (error) {
            console.error(`${color.red}[X]------- Error creating file: ${error.message}${color.default_color}`);
            return;
        }
    }
    else {
        console.log(`${color.red}[FAILED]------- ExpressiveJS haven't setup yet${color.default_color}`);
    }
};


module.exports = generateRouteFile