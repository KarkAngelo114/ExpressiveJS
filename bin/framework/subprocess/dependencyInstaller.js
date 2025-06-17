const subprocess = require('child_process');
const color_code = require('../colorCode/ANSI');

const install = () => {
    return new Promise((resolve, reject) => {
        const installCommand = 'npm install express cors dotenv mysql2 multer cloudinary multer-storage-cloudinary nodemailer express-rate-limit node-fpgrowth bcrypt ml-regression express-session jsonwebtoken cookie-parser express-mysql-session  --save-dev nodemon';

        subprocess.exec(installCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`${color_code.red}[ERROR]-------Failed to install dependencies: ${error.message}${color_code.default_color}`);
                reject(error);
            } else {
                console.log(`${color_code.green}[SUCCESS]-----Dependencies installed successfully!${color_code.default_color}`);
                resolve(stdout);
            }
        });
    });
};

const proxy_dependencies = () => {
    return new Promise((resolve, reject) => {
        const installCommand = 'npm install express cors dotenv express-rate-limit node-fetch axios http-proxy bcrypt express-session jsonwebtoken cookie-parser --save-dev nodemon';

        subprocess.exec(installCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`${color_code.red}[ERROR]-------Failed to install dependencies: ${error.message}${color_code.default_color}`);
                reject(error);
            } else {
                console.log(`${color_code.green}[SUCCESS]-----Dependencies installed successfully!${color_code.default_color}`);
                resolve(stdout);
            }
        });
    });
}

module.exports = {
    install,
    proxy_dependencies
};
