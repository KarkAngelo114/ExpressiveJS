const { green, default_color, yellow } = require("../colorCode/ANSI");

exports.random = () => {
    const charset = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567899990"
    const charLength = charset.length;

    let key = "";
    for (let i = 0; i < 50; i++) {
        key += charset.split("")[Math.floor(Math.random() * charLength)];
    }

    console.log(`${green} Generated key: ${yellow} ${key} ${default_color}`);
    console.log(`${yellow}[INFO]------- Random key generated. Please store them somewhere safe. DO NOT HARDCODE THEM to your code${default_color}`);
}