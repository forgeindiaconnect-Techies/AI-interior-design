const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = 'AIzaSyANShxF6KAa_NYoqRF3ei2oZ_AGBjJzfK0';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try to use a different endpoint or model name
  const models = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'];
  
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("test");
      console.log(`✅ Model '${m}' is available and responded:`, result.response.text().trim());
    } catch (err) {
      console.log(`❌ Model '${m}' failed:`, err.message);
    }
  }
}

listModels();
