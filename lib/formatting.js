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
            `\t\t${entryPoint}/dist/${asset.name.replace('./', '')}\t${displaySize(asset.size)}`
        ).join('\n') +
        `\n\n`
    )

    return (
        `\n\n` +
        `\x1b[38;5;51m [ Oxenode Plugin Development CDN ]` + `\n\n` +
        nodes +
        `\t\x1b[38;5;51m Plugin Entry point : \n\n` + 
        `\t\x1b[38;5;51m` +
        `\t${entryPoint}` +
        `\t\x1b[0m` +
        `\n\n`
    )
}

module.exports = {
	greet,
	addWhiteSpace,
	displaySize
}