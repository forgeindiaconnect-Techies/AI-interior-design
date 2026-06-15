const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testSimpleVision() {
  const apiKey = 'AIzaSyANShxF6KAa_NYoqRF3ei2oZ_AGBjJzfK0';
  const imgPath = path.join(__dirname, '../bedroom/modern/bedroom_modern_0.jpg');
  
  if (!fs.existsSync(imgPath)) {
    console.error("❌ Sample image not found:", imgPath);
    return;
  }
  
  const base64Data = fs.readFileSync(imgPath).toString('base64');
  const mimeType = 'image/jpeg';
  const inlineData = { inlineData: { data: base64Data, mimeType } };

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    console.log("Sending simple vision request to gemini-2.5-flash...");
    const result = await model.generateContent([
      "Describe this room image in one sentence.",
      inlineData
    ]);
    console.log("✅ SUCCESS! Response:", result.response.text());
  } catch (err) {
    console.error("❌ FAILED:", err.message);
  }
}

testSimpleVision();
