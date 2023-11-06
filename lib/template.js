module.exports = function TemplateApply(text, data) {
        
    for (const key in data) {
        const reg = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gm');
        text = text.replaceAll(reg, data[key]);
    }

    return text;
}