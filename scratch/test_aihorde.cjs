const axios = require('axios');

async function testFetch() {
  const urls = [
    'https://stablehorde.net/api/v2/generate/async',
    'https://aihorde.net/api/v2/generate/async'
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, { timeout: 10000 });
      console.log(`✅ HTTP fetch success for ${url}: status ${res.status}`);
    } catch (err) {
      console.log(`❌ HTTP fetch failed for ${url}: ${err.message}`);
      if (err.response) {
        console.log(`Response status: ${err.response.status}`);
      }
    }
  }
}

testFetch();
