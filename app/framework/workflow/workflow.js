const {exec} = require('child_process');
const util = require('util');

const execute = util.promisify(exec);

class Workflow {
    constructor () {
        this.Directory = '';
    }



    /**
    * Sets the working directory for the workflow.
    * @param {Object} config - Configuration object.
    * @param {string} [config.target_Directory] - The target directory to use. Defaults to current working directory.
    */
    config(config) {
        this.Directory = config.target_Directory || process.cwd();
    }
    
    async run(command) {
        try {

            const { stdout, stderr} = await execute(command, {
                cwd: this.Directory
            });

            if (stderr) console.log(`ℹ️ ${command} stderr:\n${stderr}`);
            console.log(`✅ Command ${command} successfully executed`);
            return stdout;
        }
        catch (error) {
            console.error(error);
        }
    }
}

module.exports = Workflow;