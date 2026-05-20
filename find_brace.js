const fs = require('fs');
const content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

let stack = [];
let i = 0;
while (i < content.length) {
  // skip multi-line comments
  if (content.startsWith('/*', i)) {
    i = content.indexOf('*/', i + 2);
    if (i === -1) break;
    i += 2; continue;
  }
  // skip single-line comments
  if (content.startsWith('//', i)) {
    i = content.indexOf('\n', i + 2);
    if (i === -1) break;
    i++; continue;
  }
  // skip strings
  if (content[i] === '\'' || content[i] === '\"' || content[i] === '\`') {
    let quote = content[i];
    i++;
    while (i < content.length) {
      if (content[i] === '\\') { i += 2; continue; }
      if (content[i] === quote) { i++; break; }
      i++;
    }
    continue;
  }
  
  if (content[i] === '{') {
    stack.push({ char: '{', pos: i, line: content.substring(0, i).split('\n').length });
  } else if (content[i] === '}') {
    if (stack.length > 0 && stack[stack.length - 1].char === '{') {
      stack.pop();
    } else {
      console.log('Extra } at line', content.substring(0, i).split('\n').length);
    }
  }
  i++;
}

console.log('Unmatched { :');
for (let s of stack) {
  console.log('Line:', s.line);
}
