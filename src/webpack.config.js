const path = require('path');
const glob = require('glob');
const terser = require('terser-webpack-plugin');
const fs = require('node:fs');
const pkg = require('./package.json');
const pluginConfig = JSON.parse(fs.readFileSync('./.oxerc', 'utf-8'));

// Find all the source files
const files = glob.sync('./src/**/*.{ts,tsx}');

const {
  CheckExportWebpackPlugin,
  CheckDefaultExportWebpackPlugin
} = require('@oxenode/cli');

// Generate an entries object
const entries = files.reduce((entries, entry) => {
  const singleEntry = path.parse(entry);
  const entryName = './' + singleEntry.name;
  entries[entryName] = './' + entry;
  return entries;
}, {});

Object.entries(entries).forEach((entry) => {
  const [k, v] = entry;
  const dest = `${path.join('dist', k)}.js`;
  process.stdout.write(`Building \x1b[92m${v}\x1b[0m to `+`\x1b[93m./${dest} \x1b[0m\n`);
});
process.stdout.write('\n');


function pluginMeta(files) {
  const index = {
    name: pkg.name || pluginConfig.name || `oxenode-plugin-untitled`,
    version: pkg.version || pluginConfig.version || `0.0.0`,
    date: new Date().toISOString().split('T')[0],
    blueprints: files.map((entry) => path.parse(entry).name),
    icon: pluginConfig.icon || 'FiBox'
  };

  if (!fs.existsSync('./dist')) fs.mkdirSync('./dist');
  fs.writeFileSync(path.join('dist', 'index.json'), JSON.stringify(index, null, 4), 'utf-8');
}

pluginMeta(files);

module.exports = {
  mode: 'production',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    liveReload: false,
    hot: false,
    compress: true,
    port: 5500,
  },
  entry: entries,
  experiments: {
    outputModule: true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      type: "module"
    },
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
        new terser({
            terserOptions: {
                keep_fnames: false,
                keep_classnames: false
            }
        })
    ]
  },
  externals: {
    '@uiw/react-textarea-code-editor': 'CodeEditor',

    '@oxenode/core': 'OxenodeCore',
    '@oxenode/ui': 'OxenodeUi',

    'react': 'React',
    'react-dom': 'ReactDOM',
    'react/jsx-runtime': 'jsxRuntimeExports'
 },
 plugins: [
  new CheckExportWebpackPlugin('Name'),
  new CheckExportWebpackPlugin('Content'),
  new CheckDefaultExportWebpackPlugin('Content'),
  new CheckExportWebpackPlugin('ports')
 ],
 externalsType: 'window',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              ["@babel/preset-env", {
                "targets": { "browsers": ["> 1%", "last 2 versions", "not ie <= 8"] },

                "exclude": ["transform-regenerator"]
              }],
              ["@babel/preset-react", {
                "runtime": "automatic" // Enables the new react-jsx and react-jsxdev transform in Babel
              }],
              "@babel/preset-typescript"
            ]
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};