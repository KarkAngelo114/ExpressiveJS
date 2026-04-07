const fs = require('fs').promises;
const path = require('path');
const { red, default_color, gray, yellow, green } = require("../colorCode/ANSI");
const cryto = require('crypto');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const emptyFilesToCreate = [
    'uploads/.gitkeep',
    'views/.gitkeep'
];

async function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (e) {
    }
}

/**
 * creates a lock file
 */
const create_lock_file = async () => {
    const filename = "expressivejs-lock.json";
    const dir = path.join(__dirname, filename);

    await fs.writeFile(dir, JSON.stringify({"hashes":{}}, null, 4), 'utf-8');
}

/**
 * 
 * @param {Object} data - saves the hashes 
 */
const save_to_lock_file = async (data) => {
    const json = path.join(__dirname, 'expressivejs-lock.json');
    const content = await fs.readFile(json, 'utf8');
    let config = JSON.parse(content);
    config['hashes'] = data;
    await fs.writeFile(json, JSON.stringify(config, null, 4), 'utf-8');
}

/**
 * 
 * @param {String} basedUrl - based url (https://raw.githubusercontent.com/KarkAngelo114/ExpressiveJS/main/src)
 * @param {String} filesToCreate - raw source files for src/ folder
 * @param {String} db_type - if null, use the Querex query builder for MySQL as default, otherwise use Querex suitable for PostgreSQL
 */
exports.createFiles = async (basedUrl, filesToCreate, db_type) => {
    await create_lock_file();
    let objects = {};

    const projectRoot = path.join(__dirname, '..', '..');
    let count = 1;
    for (const [src, dest] of filesToCreate) {
        const url_link_to_source_file = `${basedUrl}/${src}`;
        try {
            const response = await fetch(url_link_to_source_file);

            if (response.status === 404) throw new Error(`Error code: 404 - File ${url_link_to_source_file} not found. File might got moved, renamed, change, or deleted.`);
            if (!response.ok) throw new Error(`Error ${response.status} - An error occured`);

            let byte = await response.headers.get('content-length');
            let data = await response.text();

            process.stdout.write('\r'+`Byte size: ${byte}B ${green} ✓ ${gray} [GET] ${url_link_to_source_file} ${default_color}`);
            process.stdout.clearLine(1);

            const destPath = path.join(projectRoot, dest);
            await ensureDir(destPath);
            await fs.writeFile(destPath, data);
            await delay(80);

            // create hash
            const hash = cryto.createHash('md5').update(data).digest('hex');
            

            /**
             * 
             sturcture is:
                {
                    "path/to/file": hash_value,
                }
            
            This will be easier in updating
             */
            objects[dest] = hash;

            if (count >= filesToCreate.length) {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                console.log(`${green} ✓ ${gray} Done ${default_color}`);
                await save_to_lock_file(objects);
            }
            count++;
        } catch (error) {
            console.error(`${red}\n[ERROR]------- Failed to setup${default_color}\n`);
            console.error(error);
            console.log(`\nIf this error occurred, please create an issue on ${gray}https://github.com/KarkAngelo114/ExpressiveJS/issues${default_color}` );
        }
    }
    

    for (const relPath of emptyFilesToCreate) {
        const destPath = path.join(projectRoot, relPath);
        try {
            await ensureDir(destPath);
            await fs.writeFile(destPath, '');
        } catch (error) {
            console.error(`${red}[X]------- Failed to create ${relPath}: ${error.message}${default_color}`);
        }
    }
}


