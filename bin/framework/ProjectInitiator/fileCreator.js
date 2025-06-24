const fs = require('fs').promises;
const color = require('../colorCode/ANSI');
const path = require('path');

const filesToCreate = [
    ['rawApp.txt', 'App.js'],
    ['rawAPI_AUTH.txt', 'middlewares/API_Auth.js'],
    ['rawLimiter.txt', 'middlewares/express-rate-limit.js'],
    ['rawHeaderChecker.txt', 'middlewares/headers.js'],
    ['rawUploader.txt', 'middlewares/uploader.js'],
    ['rawCloudinaryupload.txt', 'applications/cloudinaryUpload.js'],
    ['rawUUID.txt', 'applications/UUID-generator.js'],
    ['rawRegex.txt', 'applications/regex.js'],
    ['rawTokenGenerator.txt', 'applications/token-generator.js'],
    ['rawDB_creator.txt', 'database/MySQL/createDatabase.js'],
    ['rawPool.txt', 'database/MySQl//pool.js'],
    ['rawQuerex.txt', 'database/MySQl/Querex.js'],
    ['rawDotENV.txt', '.env'],
    ['rawGitIgnore.txt', '.gitignore'],
    ['rawNODEMON.txt', 'nodemon.json'],
    ['rawNOTICE.txt', 'NOTICE.txt'],
    ['rawREADME.txt', 'README.md'],
    ['rawViewsGitIgnore.txt', 'views/.gitignore'],
    ['rawIndex.txt', 'views/index.html'],
    ['rawViewsTxt.txt', 'views/views.txt'],
    ['rawSession.txt', 'sessions/sessions.config.js'],
    ['rawTokenizer.txt', 'applications/tokenizer.js'],
    ['rawJaccard.txt', 'applications/jaccard-computation.js']
];

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

async function createFiles(value) {
    const projectRoot = path.join(__dirname, '..', '..');

    for (const [src, dest] of filesToCreate) {
        if (value === "postgre") {

        }
        else {
            const srcPath = path.join(__dirname, 'templates', src);
            const destPath = path.join(projectRoot, dest);

            try {
                await ensureDir(destPath);
                const content = await fs.readFile(srcPath, 'utf8');
                await fs.writeFile(destPath, content);
            } catch (error) {
                console.error(`${color.red}[X]------- Failed to create ${dest}: ${error.message}${color.default_color}`);
            }
        }
    }

    for (const relPath of emptyFilesToCreate) {
        const destPath = path.join(projectRoot, relPath);
        try {
            await ensureDir(destPath);
            await fs.writeFile(destPath, '');
        } catch (error) {
            console.error(`${color.red}[X]------- Failed to create ${relPath}: ${error.message}${color.default_color}`);
        }
    }
}

module.exports = {
    createFiles
};
