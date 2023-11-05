#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

function replaceKeywords(text, data) {
        
    for (const key in data) {
        const reg = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gm');
        text = text.replaceAll(reg, data[key]);
    }

    return text;
}

const [
    cmd,
    file,
    subcmd,
    arg1,
    arg2
] = process.argv;
const { execSync } = require('child_process');

const commands = {
    plugin: (pluginPath = '.') => {
        if (!pluginPath) return;
        
        // Create root dir
        if (!fs.existsSync(`${pluginPath}`)) fs.mkdirSync(`${pluginPath}`);
        const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, `./src/package.json`), 'utf-8'));
        const index = JSON.parse(fs.readFileSync(path.join(__dirname, `./src/.oxerc`), 'utf-8'));

        // Copy config files
        fs.cpSync(path.join(__dirname, './src/'), `${pluginPath}`, {recursive:true});

        // Change Name
        pkg.name = pluginPath;
        index.name = pluginPath;

        // Create Source Dir
        if (!fs.existsSync(`${pluginPath}/src`)) fs.mkdirSync(`${pluginPath}/src`);

        fs.writeFileSync(`./${pluginPath}/package.json`, JSON.stringify(pkg, null, 4), 'utf-8');
        fs.writeFileSync(`./${pluginPath}/.oxerc`, JSON.stringify(index, null, 4), 'utf-8');

        execSync(`npm install --prefix=${pluginPath}`,{ stdio:[0,1,2] });
    },
    
    node: (nodeName='MyNode', mode='bare') => {
        const template = fs.readFileSync(path.join(__dirname, `./templates/${mode}.node.handlebars`), 'utf-8');
        
        const src = replaceKeywords(template, { 'NODE_NAME': nodeName });
    
        fs.writeFileSync(`./src/${nodeName}.tsx`, src, 'utf-8');
    }

}

if (commands[subcmd]) 
    commands[subcmd](arg1, arg2);