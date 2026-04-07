const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const input = (input_data) => {
    return new Promise((output) => rl.question(input_data, output));
}

module.exports = {
    input,
    rl
}