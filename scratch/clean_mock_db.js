const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '..', 'backend', 'controllers');

function removeMockDbBlocks(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');

    while (true) {
        let startIdx = content.indexOf('if (global.MOCK_DB');
        if (startIdx === -1) break;

        let braceStart = content.indexOf('{', startIdx);
        if (braceStart === -1) break;

        let braceCount = 1;
        let idx = braceStart + 1;
        while (braceCount > 0 && idx < content.length) {
            if (content[idx] === '{') braceCount++;
            else if (content[idx] === '}') braceCount--;
            idx++;
        }

        if (braceCount === 0) {
            let lineStart = content.lastIndexOf('\n', startIdx);
            if (lineStart !== -1) {
                content = content.substring(0, lineStart + 1) + content.substring(idx);
            } else {
                content = content.substring(0, startIdx) + content.substring(idx);
            }
        } else {
            break;
        }
    }

    fs.writeFileSync(filepath, content, 'utf8');
}

fs.readdirSync(controllersDir).forEach(file => {
    if (file.endsWith('.js')) {
        removeMockDbBlocks(path.join(controllersDir, file));
        console.log(`Processed ${file}`);
    }
});
