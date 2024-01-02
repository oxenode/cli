const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('child_process');

const TemplateApply = require('./template');
const StartDevWatch = require('./server');

const colors = [
    '38;5;51', 
    '38;5;49', 
    '38;5;120'
];

const formatCommand = (sub) => {
    let str = `\n \x1b[38;5;102m${sub.title}\x1b[0m\n`;
    str +=  `  `;
    str += sub.example.split(' ').map((content, i) => {
        return `\x1b[${colors[Math.min(i, colors.length-1)]}m${content}`;
    }).join(' ') + '\x1b[0m\n';
    return str;
}

const injectHelpMenu = (subcommands) => {
    let helpMenu = '\n@oxenode/cli help menu\n';

    for (const name in subcommands) {
        const sub = subcommands[name];
        helpMenu += formatCommand(sub);
    }
    helpMenu += '\n';

    subcommands['help'] = {
        title: 'help',
        command: () => {
            process.stdout.write(helpMenu);
        }
    }

    return subcommands;
}

module.exports = injectHelpMenu({
    /**
     * Workflow
     */

    'dev': {
        title: 'Start the development server',
        example: 'oxenode dev',
        command: StartDevWatch
    },

    /**
     *  Init 
     */
    'create-plugin': {
        title: 'Create a plugin',
        example: 'oxenode create-plugin <plugin_name>',
        command: (pluginPath = '.') => {
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
    
            // Add a readme
            const readmeTemplate = fs.readFileSync(path.join(__dirname, `../templates/README.handlebars`), 'utf-8');
            const src = TemplateApply(readmeTemplate, { 'PLUGIN_NAME': pkg.name });
            fs.writeFileSync(`./${pluginPath}/README.md`, src, 'utf-8');
    
            execSync(`npm install --prefix=${pluginPath}`,{ stdio:[0,1,2] });
        }
    },
    
    'create-node': {
        title: 'Create a node',
        example: 'oxenode create-node <node_name>',
        command: (nodeName='MyNode', mode='bare') => {

            if (fs.existsSync(`./src/${nodeName}.tsx`)) {
                console.log(`Node ${nodeName} already exists, cancelling...`);
                return;
            }
    
            const template = fs.readFileSync(path.join(__dirname, `../templates/${mode}.node.handlebars`), 'utf-8');
            
            const src = TemplateApply(template, { 'NODE_NAME': nodeName });
        
            fs.writeFileSync(`./src/${nodeName}.tsx`, src, 'utf-8');
        }
    }
});

