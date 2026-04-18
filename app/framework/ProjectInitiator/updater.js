const { red, default_color, gray, yellow, green, skyBlue } = require("../colorCode/ANSI");
const currentVersion = require('./config.json')['version'];
const has_db = require('./config.json')['has-db'];
const fs = require('fs').promises;
let baseUrl = "https://raw.githubusercontent.com/KarkAngelo114/ExpressiveJS/main";
const crypto = require('crypto');
const path = require('path');
const { uninstall, install } = require("../subprocess/dependencyInstaller");
const { updateVersion, getVersion } = require("./config");

const updateFile = async (local_path_to_file, file_content, lock_file_path, lock_file_content) => {
    // 1. update the content of the local file
    await fs.writeFile(local_path_to_file, file_content);

    // 2. update hash value by accessing the corresponding file path as key
    lock_file_content.hashes[local_path_to_file] = await crypto.createHash('md5').update(file_content).digest('hex');
    await fs.writeFile(lock_file_path, JSON.stringify(lock_file_content, null, 4), 'utf-8');
}

/**
 * 
 * @param {String} filePath - local file path. If the local path doesn't exists, create the path 
 */
const ensureDir = async (filePath) => {
    const dir = path.dirname(filePath);
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (e) {
    }
}

/**
 * 
 * @param {Array<String>} array - [src, local_file_path] 
 * @param {Boolean} has_database -true or false 
 * @param {Object} json_content - loaded json file 
 * @param {String} json_file - path to json file 
 * @returns 
 */
const add_files = async (array, has_database, json_content, json_file) => {
    const [src, local_path_to_file] = array;
    try {
        

        // if the config.json has-db property is false and the local path to file starts with database/, we skip those file to be added so that projects that doesn't have database files won't magically have database files while updating
        if (!has_database && local_path_to_file.toLowerCase().startsWith('database/')) {
            console.log(`${skyBlue}Skipped to add... ${gray}${local_path_to_file}${default_color}`);
            return;
        }

        let fileExists = true;

        try {
            await fs.access(local_path_to_file);
        } catch (err) {
            if (err.code === "ENOENT") fileExists = false;
            else throw err;
        }

        const source_file = `${baseUrl}/src/${src}`;
        const response = await fetch(source_file);

        if (response.status == 404) throw new Error(`Error 404: File not found. File ${source_file} might have been moved, renamed, or deleted`);
        if (!response.ok) throw new Error(`Error: ${response.status} Failed to fetch`);

        const data = await response.text();
        const new_hash = crypto.createHash('md5').update(data).digest('hex');

        if (fileExists) {
            const local_data = await fs.readFile(local_path_to_file, 'utf-8');
            const local_hash = crypto.createHash('md5').update(local_data).digest('hex');

            const saved_hash = json_content.hashes[local_path_to_file];

            // CASE 1: file was modified by user, skip adding the incoming file. It will be a very huge mess if an already existing file is modified but got overwritten (assume the file is manually downloaded from the main repo before running an update)
            if (saved_hash && local_hash !== saved_hash) {
                console.log(`${skyBlue}Skipped (modified)... ${gray}${local_path_to_file}${default_color}`);
                return;
            }

            //  CASE 2: identical to incoming, skip adding the file. Why add a file if there's already an existing one
            if (local_hash === new_hash) {
                console.log(`${skyBlue}Skipped (identical)... ${gray}${local_path_to_file}${default_color}`);
                return;
            }
        }

        // write file
        await ensureDir(local_path_to_file);
        await fs.writeFile(local_path_to_file, data);

        // update lock hash
        json_content.hashes[local_path_to_file] = new_hash;
        await fs.writeFile(json_file, JSON.stringify(json_content, null, 4), 'utf-8');

        console.log(`Added... ${gray}${local_path_to_file}${green} ✓${default_color} Byte size: ${response.headers.get('content-length')}B`);    
    }
    catch (error) {
        console.log(`\n\n${red}-- Error fetching --${default_color}\nReason:`);
        console.error(error);
        console.log(`\nIf this error occurred, please create an issue on ${gray}https://github.com/KarkAngelo114/ExpressiveJS/issues${default_color}` );
        process.exit(1);
    }
}

/**
 * 
 * @param {Array<String>} src - ["src file", "localpath"] 
 * @param {*} flag 
 */
const applyUpdate = async (src, flag) => {
    const [source_file, local_path_to_file] = src;
    const json_file = path.join(__dirname, 'expressivejs-lock.json');
    let content = JSON.parse(await fs.readFile(json_file, 'utf-8')); // will be use to update hash if a target file is modified or using the "--force" flag
    const response = await fetch(`${baseUrl}/src/${source_file}`);
    let  byte = response.headers.get('content-length');

    try {
        
        await fs.access(local_path_to_file);
        const local_hash = await crypto.createHash('md5').update(await fs.readFile(local_path_to_file, 'utf-8')).digest('hex');
        const saved_hash  = content.hashes[local_path_to_file];

        if (response.status == 404) throw new Error("File not found. The file my have been moved, renamed, or deleted");
        if (!response.ok) throw new Error(`Error: ${response.status} Failed to fetch`);

       
        const file_content = await response.text(); 

        // Force update a targeted module. DANGEROUS flag, it will override the contents of the target file without hash checking. Ensure that the target files are not modified when using this flag.
        if (flag === "--force") {
            
            await updateFile(local_path_to_file, file_content, json_file, content);

            console.log(`${yellow}FORCE UPDATE... ${default_color}Byte size: ${byte}B ${gray}${local_path_to_file} ${default_color} -- has been updated`);
            return;
        }

        // if a local hash and saved hash are the same (assume that the target file is safe to update because no user modifications) and the flag is not "--force", perform the update
        if (local_hash === saved_hash) {
            await updateFile(local_path_to_file, file_content, json_file, content);
            console.log(`Updating... Byte size: ${byte}B ${gray}${local_path_to_file}${default_color}`);
        }
        else {
            console.log(`${skyBlue}Skipped... ${default_color}Byte size: ${byte}B ${gray}${local_path_to_file} - For safety, modified file cannot be updated. ${default_color}`);
        }        
    }
    catch (error) {
        if (error.code === "ENOENT") {
            console.log(`${red}Ignored... ${default_color}Byte size: ${byte}B ${gray}${local_path_to_file}${default_color}`);
        }
        else {
            console.log(`\n\n${red}-- Error fetching --${default_color}\nReason:`);
            console.error(error);
            console.log(`\nIf this error occurred, please create an issue on ${gray}https://github.com/KarkAngelo114/ExpressiveJS/issues${default_color}` );
            process.exit(1);
        }
    }
}

/**
 * 
 * @param {String} filePath - local file path to delete 
 */
const deleteFile = async (filePath, json_content, json_file) => {
    try {
        // DO NOT DELETE any files inside "database/" folder
        if (filePath.toLowerCase().startsWith('database/')) {
            console.warn(`${yellow}Warn... Unable to delete ${filePath}. Critical file asset.`);
            return;
        }

        // delete the file
        await fs.unlink(filePath);
        //remove key value pair
        delete json_content.hashes[filePath];
        await fs.writeFile(json_file, JSON.stringify(json_content, null, 4), 'utf-8');

        console.log(`Deleted... ${gray}${filePath}${default_color}`);
    }
    catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
}

/**
 * 
 * @param {String} flag - if "--force" flag is set, force update modules that are in the metadata 
 * @returns 
 */
exports.initiateUpdate = async (flag) => {
    const json_file = path.join(__dirname, 'expressivejs-lock.json');
    let content = JSON.parse(await fs.readFile(json_file, 'utf-8'));
    try {
        
        /**
            Update flow:
            1. fetch metadata.json
            2. check if the flag is "--force", if "--force", no need to check for Updatable exported boolean value
            3. In updating, ensure that the file to be updated exists. If exist, update the file.
            4. Update version in the config.json
            5. Using the updated version property from the config.json, we pull the files to be added according to the version property
            6. In adding the files, endure that the directory exists.
         */
        
        console.log("Fetching update...");
        const response = await fetch(`${baseUrl}/metadata.json`);


        if (response.status === 404) throw new Error("Metadata.json not found. Either the JSON file is moved, renamed, changed, or deleted.");
        if (response.status === 500) throw new Error(`Failed to fetch metadata.json. Status Code:${response.status}`);

        console.log(`${green} ✓ ${gray}[GET] ${baseUrl}/metadata.json ${default_color}`);

        const data = await response.json();
        const versionKey = data.version;
        const versionData = data[versionKey];

        const files_to_update = versionData.files_to_update || []; // using the latest version as key, we get the array of files to update
        const files_to_add = versionData.files_to_add || []; // using the latest version as key, we get the array of files to be added

        if (currentVersion === data.version) {
            console.log(`Everything is up to date`);
            process.exit(0);
        }

        console.log(`Current version: ${yellow}${currentVersion}${default_color}`);
        console.log(`New version: ${green}${data.version}${default_color}`);
        await delay(1000);
        
        if (files_to_update.length > 0) {
            console.log("Files to update:\n");
            await delay(1000);
            files_to_update.forEach(arr => console.log(`${yellow}${arr[1]}${default_color}`));
            console.log("\nApplying update...\n");
            await delay(1000);
            for (const arr of  files_to_update) {
                await applyUpdate(arr, flag);
            }
        }

        if (files_to_add.length > 0) {
            console.log(`\nFiles to add...\n`);
            files_to_add.forEach(file => console.log(`- ${file[1]}`));
            console.log();
            for (const files_arr of files_to_add) {
                await add_files(files_arr, has_db, content, json_file);
            }
        }

        if (data.files_to_delete.length > 0) {
            console.log(`\nDeleting files...`);
            for (const file_path of data.files_to_delete) {
                await deleteFile(file_path, content, json_file);
            }
        }

        if (data.dependency_update.length > 0 || data.no_db_dependency_update.length > 0) {
            console.log(`Updating dependencies...`);
            const deps = has_db ? data.dependency_update : data.no_db_dependency_update;
            await uninstall(deps);
            await install(deps);
        }
        
        // save local version
        await updateVersion(data.version);
        await delay(2000);
        console.log(`${green} ✓ ${default_color}Update complete...\n`);
        await getVersion();
        process.exit(0);
    }
    catch (error) {
        console.log(`\n\n${red}-- Error fetching --${default_color}\nReason:`);
        console.error(error);
        console.log(`\nIf this error occurred, please create an issue on ${gray}https://github.com/KarkAngelo114/ExpressiveJS/issues${default_color}` );
        process.exit(1);
    }
};

exports.checkUpdate = async () => {
    try {
        console.log("Checking for update...");
        console.log(`${green} ✓ ${gray}[GET] ${baseUrl}/metadata.json ${default_color}`);

        const response = await fetch(`${baseUrl}/metadata.json`);
        const change_log_res = await fetch(`${baseUrl}/CHANGELOG.md`);

        if (response.status === 404) throw new Error("Metadata.json not found. Either the JSON file is moved, renamed, changed, or deleted.");
        if (response.status === 500) throw new Error(`Failed to fetch metadata.json. Status Code:${response.status}`);
        if (change_log_res.status === 404) throw new Error("Changelog not found. Either the file is moved, renamed, changed, or deleted."); 
        if (change_log_res.status === 500) throw new Error(`Failed to fetch changelog. Status Code:${response.status}`);

        const data = await response.json();
        const changelog = await change_log_res.text();

        if (currentVersion === data.version) {
            console.log(`Everything is up to date`);
            process.exit(0);
        }

        console.log(`\nCurrent version: ${yellow}${currentVersion}${default_color}`);
        console.log(`New version: ${green}${data.version}${default_color}`);

        console.log(`${gray}\n===================\n${yellow}***Change Log***${gray}\n===================\n${default_color}\n`,changelog);

        console.log(`${yellow}\n----------------------- ${default_color} Below are the other details what to update ${yellow}----------------------- ${default_color}`)
        console.log(`\nFiles to update:`);
        data[data.version].files_to_update.forEach(file => console.log(`- ${file[1]}`));
        console.log(`\nFiles to add:`);
        data[data.version].files_to_add.forEach(file => console.log(`- ${file[1]}`));
        

        if (data.files_to_delete.length > 0) {
            console.log(`\nFiles to delete:`);
            data.files_to_delete.forEach(file => console.log(`- ${file}`));
        }
        
        process.exit(0);
    }
    catch (error) {
        console.log(`${red}Error: ${default_color}`);
        console.error(error);
        console.log(`\nIf this error occurred, please create an issue on ${gray}https://github.com/KarkAngelo114/ExpressiveJS/issues${default_color}` );
        process.exit(1);
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));