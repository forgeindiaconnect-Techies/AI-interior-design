const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiV1() {
  const apiKey = 'AIzaSyANShxF6KAa_NYoqRF3ei2oZ_AGBjJzfK0';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Try passing apiVersion in options
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: "v1" }
    );
    const result = await model.generateContent("Say hello!");
    console.log("✅ SUCCESS with gemini-1.5-flash on v1:", result.response.text().trim());
  } catch (err) {
    console.log("❌ Failed with gemini-1.5-flash on v1:", err.message);
  }
}

testGeminiV1();
