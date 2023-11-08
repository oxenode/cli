const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('child_process');

const TemplateApply = require('./template');
const StartDevWatch = require('./server');

module.exports = {
    /**
     * Workflow
     */
    'watch': StartDevWatch,
    'dev': StartDevWatch,

    /**
     *  Init 
     */
    'create-plugin': (pluginPath = '.') => {
        if (!pluginPath) return;
        
        if (fs.existsSync(pluginPath)) {
            console.log(`Plugin ${pluginPath} already exists, cancelling...`);
            return;
        }

        // Create root dir
        if (!fs.existsSync(`${pluginPath}`)) fs.mkdirSync(`${pluginPath}`);
        const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/package.json`), 'utf-8'));
        const index = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/.oxerc`), 'utf-8'));

        // Copy config files
        fs.cpSync(path.join(__dirname, '../src'), `${pluginPath}`, {recursive:true});

        // Change Name
        pkg.name = pluginPath;
        index.name = pluginPath;

        // Create Source Dir
        if (!fs.existsSync(`${pluginPath}/src`)) fs.mkdirSync(`${pluginPath}/src`);

        fs.writeFileSync(`./${pluginPath}/package.json`, JSON.stringify(pkg, null, 4), 'utf-8');
        fs.writeFileSync(`./${pluginPath}/.oxerc`, JSON.stringify(index, null, 4), 'utf-8');

        execSync(`npm install --prefix=${pluginPath}`,{ stdio:[0,1,2] });
    },
    
    'create-node': (nodeName='MyNode', mode='bare') => {

        if (fs.existsSync(`./src/${nodeName}.tsx`)) {
            console.log(`Node ${nodeName} already exists, cancelling...`);
            return;
        }

        const template = fs.readFileSync(path.join(__dirname, `../templates/${mode}.node.handlebars`), 'utf-8');
        
        const src = TemplateApply(template, { 'NODE_NAME': nodeName });
    
        fs.writeFileSync(`./src/${nodeName}.tsx`, src, 'utf-8');
    },

    'help': () => {
        console.log(
            `
    @oxenode/cli help

    \x1b[38;5;102m Create a plugin:\x1b[0m

        \x1b[38;5;51m oxenode\x1b[38;5;49m create-plugin \x1b[38;5;120m<plugin_name>

    \x1b[38;5;102m Create Nodes in a plugin:\x1b[0m

        \x1b[38;5;51m oxenode\x1b[38;5;49m create-node \x1b[38;5;120m<node_name>

    \x1b[38;5;102m Start a development server for your plugin:\x1b[0m

        \x1b[38;5;51m oxenode\x1b[38;5;49m dev\x1b[0m
            
            `
        )
    }
}