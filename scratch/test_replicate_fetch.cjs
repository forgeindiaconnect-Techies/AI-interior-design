const axios = require('axios');

async function testReplicate() {
  try {
    const res = await axios.get('https://api.replicate.com/v1/models', { timeout: 10000 });
    console.log("✅ HTTP fetch success for Replicate:", res.status);
  } catch (err) {
    console.log("❌ HTTP fetch failed for Replicate:", err.message);
  }
}

testReplicate();
