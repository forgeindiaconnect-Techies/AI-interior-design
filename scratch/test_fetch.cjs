const axios = require('axios');

async function testFetch() {
  const urls = [
    'https://www.google.com',
    'https://api-inference.huggingface.co',
    'https://image.pollinations.ai'
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, { timeout: 10000 });
      console.log(`✅ HTTP fetch success for ${url}: status ${res.status}`);
    } catch (err) {
      console.log(`❌ HTTP fetch failed for ${url}: ${err.message}`);
    }
  }
}

testFetch();
