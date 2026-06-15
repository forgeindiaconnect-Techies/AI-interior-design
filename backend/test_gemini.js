const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = 'AIzaSyANShxF6KAa_NYoqRF3ei2oZ_AGBjJzfK0';
  console.log("Testing Gemini API connection with key:", apiKey.substring(0, 10) + "...");
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hello!");
    console.log("✅ SUCCESS! Gemini responded:", result.response.text());
  } catch (err) {
    console.error("❌ ERROR: Gemini request failed:", err.message);
  }
}

testGemini();
