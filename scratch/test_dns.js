const dns = require('dns');
const axios = require('axios');

console.log("Testing DNS resolution...");

const hosts = ['google.com', 'huggingface.co', 'api-inference.huggingface.co', 'image.pollinations.ai'];

hosts.forEach(host => {
  dns.resolve4(host, (err, addresses) => {
    if (err) {
      console.log(`❌ DNS Resolve failed for ${host}: ${err.message}`);
    } else {
      console.log(`✅ DNS Resolve success for ${host}: ${JSON.stringify(addresses)}`);
    }
  });
});

console.log("Testing HTTP fetch...");
axios.get('https://www.google.com')
  .then(() => console.log("✅ HTTP fetch success for google.com"))
  .catch(err => console.log(`❌ HTTP fetch failed for google.com: ${err.message}`));
