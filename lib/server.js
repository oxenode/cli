const express = require('express');
const webpack = require('webpack');
const fs = require('node:fs');
const path = require('node:path');

function addWhiteSpace(str, spaceCount) {
    for (let i = 0; i < spaceCount; i++)
        str = ' ' + str;

    return str;
}

function displaySize(size) {
    const units = [
        'B',
        'Kb',
        'Mb'
    ]

    let unit = units[0];
    let div = 0;

    for (let i = 0; i < units.length; i++) {
        const value = Math.pow(10, i * 3);
        
        if (size > value) {
            unit = units[i];
            div = value;
        }
    }

    let scaledSize = (size / div);
    scaledSize = scaledSize < 10 ? scaledSize.toFixed(2) : scaledSize;

    scaledSize = scaledSize.toString();
    scaledSize = scaledSize.length < 4 ? addWhiteSpace(scaledSize, 4 - scaledSize.length) : scaledSize;
    

    return `${scaledSize} ${unit}`;


}

function greet(entryPoint, files, index) {

    const nodes = (files.length === 0) ? 
    (

        `\t\x1b[38;5;178m [ Warning ]\n` +
        `\t\x1b[38;5;102m No nodes were found in ./src \n` + 
        `\t\x1b[38;5;102m Add new nodes by running:\n\n` +
        `\t\t\x1b[38;5;51moxenode\x1b[38;5;49m create-node \x1b[38;5;120m<node_name>\n` + 
        `\t\x1b[0m` +
        `\n\n`
    ):
    (
        `\t\x1b[38;5;73m Nodes : \n\n` +
        `\x1b[38;5;73m` +
        files.map((asset) => 
            `\t\t${entryPoint}${asset.name.replace('./', '')}\t${displaySize(asset.size)}`
        ).join('\n') +
        `\n\n`
    )

    return (
        `\n\n` +
        `\x1b[38;5;51m [ Oxenode Plugin Development CDN ]` + `\n\n` +
        nodes +
        `\t\x1b[38;5;51m Plugin Entry point : \n\n` + 
        `\t\x1b[38;5;51m` +
        `\t${entryPoint}${index}` +
        `\t\x1b[0m` +
        `\n\n`
    )
}

module.exports = function StartDevWatch() {

    const webpackConfig = require(path.join(process.cwd(), './webpack.config.js'));

    const entryPoint =
      `http://127.0.0.1:${webpackConfig.devServer.port}/dist/`;

    const app = express();

    // serve static built files from 'dist' folder
    app.use('/dist', express.static('dist'));

    let compiler = webpack(webpackConfig);
    const PostRebuild = (err, stats) => {
        if (err) {
            console.error(err);
        } else {
            const info = stats.toJson("verbose");

            console.log(`\x1b[2J\x1b[H`); // CLEAR SCREEN
            
            if (stats.hasErrors()) {
                const error = stats.toString({ chunks: true, colors: true });
                console.log(
                    error + '\n\n' + error.slice(0, 1024)
                );
            } else {
                console.log(
                    `\x1b[38;5;51m` + ` [ Webpack Logs ]:\n\n` + `\x1b[38;5;102m` + 
                    
                    '\t' + stats.toString({ chunks: false, colors: false }).split('\n').join('\n\t') +
                    `\x1b[0m`
                );
                console.log(greet(entryPoint, info.assets, 'index.json'))
            }

        }
        compiler.close(() => {
            compiler = webpack(webpackConfig);
        })
    }
    
    compiler.run(PostRebuild);

    // Redirect default paths to index.json
    app.get('/dist', (req, res) => {
        res.redirect('/dist/index.json');
    });

    app.get('/', (req, res) => {
        res.redirect('/dist/index.json');
    });

    // start server
    app.listen(webpackConfig.devServer.port, () => {
        console.log(`\x1b[38;5;102m Starting development server...\n\x1b[0m`);
    });

}