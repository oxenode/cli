const path = require('node:path');
const docsUrl = 'https://oxenode.io/docs/Node'

class CheckDefaultExportWebpackPlugin {
    constructor(validateProps, message) {
        this.validateProps = validateProps;
        this.message = message;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('CheckDefaultExportWebpackPlugin', (compilation) => {
            compilation.hooks.seal.tap('CheckDefaultExportWebpackPlugin', () => {
                compilation.modules.forEach((module) => {
                    const data = module.resourceResolveData;
                    if (!data) return;

                    const sourceDirectoryPath = path.dirname(data.relativePath || data.__innerRequest);
                    if (sourceDirectoryPath !== './src') return;
                    
                    const isDealingWithJs = /\.(j|t)s(x?)$/;
                    if (!isDealingWithJs.test(module.resource)) return;

                    let defaultExportFound;
                    for (let dep of module.dependencies) {
                        if (dep.name === 'default' && dep.id === this.validateProps) {
                            defaultExportFound = true; 
                        }
                    }

                    if (!defaultExportFound) {
                        compilation.errors.push(
                            new Error(
                                this.message ||
                                `Missing export default "${this.validateProps}" in module ${module.resource}\n`+
                                `\t\x1b[38;5;51m [Oxenode]: A valid Node should have the Content React Component as default export.\n\t`+
                                ` See: \x1b[4m${docsUrl}\x1b[0m \x1b[0m`
                            )
                        );
                    }                    
                });
            });
        });
    }
}

class CheckExportWebpackPlugin {
    constructor(validateProps, message) {
        this.validateProps = validateProps;
        this.message = message;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('CheckExportWebpackPlugin', (compilation) => {
            compilation.hooks.seal.tap('CheckExportWebpackPlugin', () => {
                compilation.modules.forEach((module) => {

                    const data = module.resourceResolveData;
                    if (!data) return;

                    const sourceDirectoryPath = path.dirname(data.relativePath || data.__innerRequest);
                    if (sourceDirectoryPath !== './src') return;

                    const isDealingWithJs = /\.(j|t)s(x?)$/;
                    if (!isDealingWithJs.test(module.resource)) return;

                    let propFound;

                    if (module.buildInfo.topLevelDeclarations)
                    for (let declaration of module.buildInfo.topLevelDeclarations) {
                        if (declaration === this.validateProps) {
                            propFound = true; 
                            continue;
                        }
                    }

                    if (!propFound) {
                        compilation.errors.push(
                            new Error(
                                this.message ||
                                `Missing export "${this.validateProps}" in module ${module.resource}\n`+
                                `\t\x1b[38;5;51m [Oxenode]: A valid Node should have at least a ${this.validateProps} export.\n\t`+
                                ` See: \x1b[4m${docsUrl}\x1b[0m \x1b[0m`
                            )
                        );
                    }                    
                });
            });
        });
    }
}

module.exports = {CheckExportWebpackPlugin, CheckDefaultExportWebpackPlugin};