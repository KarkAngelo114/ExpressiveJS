const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

const createMigrationFile = async (migrationName) => {
    const json = path.join(__dirname, '..', 'ProjectInitiator', 'config.json');
    const content = await fs.readFile(json, 'utf8');
    const config = JSON.parse(content);

    let is_configure = config['has_Setup'];

    if (is_configure) {
        if (!migrationName) {
            console.error(`${color.red}[X]------- Please provide a migration name. ${color.default_color}`);
            return;
        }

        const filename = `${migrationName}.js`;
        const root = path.join(__dirname, '..', '..');
        const migrationDir = path.join(root, 'database', 'migrations');
        const createFilePath = path.join(migrationDir, filename);

        let templateContent = "";
        try {
            const templatePath = path.join(__dirname, 'template.txt');
            templateContent = await fs.readFile(templatePath, 'utf8');
        }
        catch (error) {
            console.error(`${color.red}[X]------- Failed to read template file: ${error.message}${color.default_color}`);
            return;
        }
        
        
        try {
            await fs.mkdir(migrationDir, {recursive: true})
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

module.exports = createMigrationFile