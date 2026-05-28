const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/renug/OneDrive/Desktop/AI Interior Final Project/frontend/src';
const files = [
  'components/Navbar.jsx',
  'components/Footer.jsx',
  'components/UserSidebar.jsx',
  'components/VendorSidebar.jsx',
  'components/AdminSidebar.jsx',
  'pages/LoginPage.jsx',
  'pages/RegisterPage.jsx',
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace import
  // Add Armchair, Sparkles if not present
  if (!content.includes('Armchair')) {
    content = content.replace(/import \{([^}]+)\} from 'lucide-react';/g, (match, p1) => {
      let imports = p1.split(',').map(s => s.trim()).filter(s => s !== 'Palette');
      if (!imports.includes('Armchair')) imports.push('Armchair');
      if (!imports.includes('Sparkles')) imports.push('Sparkles');
      return `import { ${imports.join(', ')} } from 'lucide-react';`;
    });
  }

  // Replace usages of Palette
  // We need to match <Palette className="w-X h-X ..." />
  // or <Palette style={{...}} />
  
  content = content.replace(/<Palette\s+className="([^"]+)"\s*\/>/g, (match, className) => {
    // extract width/height classes to size the armchair and sparkles proportionately
    // if className is "w-6 h-6 text-white", we can just pass it to Armchair, and use a smaller absolute Sparkles.
    return `<div className="relative flex items-center justify-center">
              <Armchair className="${className}" />
              <Sparkles className="w-1/2 h-1/2 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </div>`;
  });

  content = content.replace(/<Palette\s+style=\{([^}]+)\}\s*\/>/g, (match, styleObj) => {
    return `<div className="relative flex items-center justify-center" style={${styleObj}}>
              <Armchair style={{ width: '100%', height: '100%' }} />
              <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" style={{ width: '50%', height: '50%' }} />
            </div>`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
});
