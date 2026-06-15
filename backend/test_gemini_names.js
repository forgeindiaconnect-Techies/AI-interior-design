const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testNames() {
  const apiKey = 'AIzaSyANShxF6KAa_NYoqRF3ei2oZ_AGBjJzfK0';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const names = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro-002',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash-lite'
  ];

  for (const name of names) {
    try {
      const model = genAI.getGenerativeModel({ model: name });
      const result = await model.generateContent("Say hello!");
      console.log(`✅ Model '${name}' worked! Response:`, result.response.text().trim());
      return; // Stop on first success
    } catch (err) {
      console.log(`❌ Model '${name}' failed:`, err.message);
    }
  }
}

testNames();
