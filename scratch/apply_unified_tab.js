const fs = require('fs');

const adminDashboardPath = 'frontend/src/pages/AdminDashboard.jsx';
const replacementBlockPath = 'scratch/replacement_block.txt';

let content = fs.readFileSync(adminDashboardPath, 'utf8');
const replacement = fs.readFileSync(replacementBlockPath, 'utf8');

// 1. Inject States
const stateMarker = "const [selectedMsgUser, setSelectedMsgUser] = useState('');";
const statesToAdd = `
  const [selectedMsgUser, setSelectedMsgUser] = useState('');
  const [customDesignFilter, setCustomDesignFilter] = useState('All Requests');
  const [customRequestSearch, setCustomRequestSearch] = useState('');
  const [customRequestStatusFilter, setCustomRequestStatusFilter] = useState('all');
  const [customRequestRoomFilter, setCustomRequestRoomFilter] = useState('all');
  const [customRequestBudgetFilter, setCustomRequestBudgetFilter] = useState('all');`;

if (content.includes(stateMarker)) {
  content = content.replace(stateMarker, statesToAdd);
  console.log('✅ States successfully injected.');
} else {
  console.error('❌ Could not find stateMarker in AdminDashboard.jsx!');
  process.exit(1);
}

// 2. Inject sync tab
const syncMarker = `if (activeTab === 'manual_designs' || activeTab === 'orders' || activeTab === 'ai_designs' || activeTab === 'designer_requests') {`;
const syncReplacement = `if (activeTab === 'custom_design_requests' || activeTab === 'manual_designs' || activeTab === 'orders' || activeTab === 'ai_designs' || activeTab === 'designer_requests') {`;
if (content.includes(syncMarker)) {
  content = content.replace(syncMarker, syncReplacement);
  console.log('✅ syncLocalDataToAdminState trigger successfully updated.');
} else {
  console.error('❌ Could not find syncMarker in AdminDashboard.jsx!');
  process.exit(1);
}

// 3. Replace the Tab content
const startTag = "{activeTab === 'ai_designs' && (() => {";
const endTag = `
      {/* TAB 9: ORDERS & WORKFLOW */}`;

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  const pre = content.substring(0, startIndex);
  const post = content.substring(endIndex);
  
  content = pre + replacement + post;
  console.log('✅ Tabs successfully unified and replaced.');
} else {
  console.error('❌ Could not find tab boundaries in AdminDashboard.jsx!');
  process.exit(1);
}

fs.writeFileSync(adminDashboardPath, content, 'utf8');
console.log('🎉 AdminDashboard.jsx successfully updated.');
