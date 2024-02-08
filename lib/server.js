const path = require('node:path');

const webpack = require('webpack');
const express = require('express');
const cors = require('cors');

const { greet } = require('./formatting');

module.exports = function StartDevWatch() {

    const webpackConfig = require(path.join(process.cwd(), './webpack.config.js'));

    const entryPoint =
      `http://127.0.0.1:${webpackConfig.devServer.port}`;

    const app = express();
    app.use(cors({
        origin: '*'
    }));

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
    app.get('/dist', (_, res) => {
        res.redirect('/dist/index.json');
    });

    app.get('/', (_, res) => {
        res.redirect('/dist/index.json');
    });

    // start server
    app.listen(webpackConfig.devServer.port, () => {
        console.log(`\x1b[38;5;102m Starting development server...\n\x1b[0m`);
    });

}