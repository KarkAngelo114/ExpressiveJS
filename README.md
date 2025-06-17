## ExpressiveJS

ExpressiveJS is a backend framework for web-development built on top of NodeJS and ExpressJS. It utilizes most of the libraries
and the ExpressJS framework itself (including some of it's middlewares and other applications), stream-lining rapid development and improve productivity. And with the help of this framework, it modularize everything, keeping things organized and code clarity. ExpressiveJS follows the MVC (Model-View-Controller) architecture, allowing developers to have a clear separation of concerns, especially on debugging.

## How to start?
1. You can download the source inside the bin folder or the zip file. Recommended to download the zipped one as it is the cleaned-up version. Mostly there will be bugs when downloading the raw files as the developer keeps committing updates/changes. The one's inside the zip file are the finalized version.

2. Place the zip file or the source code to your project directory and unzip it there. You will get the ExpressiveCLI and the framework folder which contains the internal workings of the application.

3. Unlike other NodeJS frameworks that automatically can be use after installation, in ExpressiveJS, bootstrapping the project requires you to enter a command in your CMD, terminal or whatever you use to execute commands. For this, execute:

```bash
node expressivecli initiate-setup
```

this will setup your project automatically - creating folders, generating ready-to-use JS files, .env, .gitignore, App.js, and etc. so you don't need to create folders and other files.

4. Once everything is setup, explore and familiarize. Execute:

```bash
node expressivecli --help
```

this will give you idea what to do with the help of the CLI

5. ExpressiveJS might not generate all the applications needed for your project, feel free to add more that suits your need.



--- Thank you for using ExpressiveJS :)---