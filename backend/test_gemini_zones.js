const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateGeminiContent(genAI, prompt, inlineData, retries = 3) {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
  let lastError = null;

  for (const modelName of models) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempting Gemini analysis with ${modelName} (Attempt ${attempt})...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, inlineData]);
        return result;
      } catch (err) {
        lastError = err;
        console.warn(`⚠️ Model ${modelName} attempt ${attempt} failed: ${err.message}`);
        if (err.message.includes('503') || err.message.includes('429') || err.message.includes('demand')) {
          console.log("Waiting 3 seconds before retry...");
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          break; // break retry loop to try next model
        }
      }
    }
  }
  throw lastError || new Error("All Gemini models failed");
}

async function testGeminiZones() {
  const apiKey = 'AIzaSyANShxF6KAa_NYoqRF3ei2oZ_AGBjJzfK0';
  const imgPath = path.join(__dirname, '../bedroom/modern/bedroom_modern_0.jpg');
  
  if (!fs.existsSync(imgPath)) {
    console.error("❌ Sample image not found:", imgPath);
    return;
  }
  
  const base64Data = fs.readFileSync(imgPath).toString('base64');
  const mimeType = 'image/jpeg';

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `You are a Senior Interior Designer. Analyze this room image and design a complete interior redesign. 
You must NOT generate a new image; instead, analyze the existing room structure and propose specific, context-aware design additions (furniture placement, wall decor, lighting, color swatches) that overlay onto the original image.

Provide a structured JSON response (return only valid JSON, no markdown wrap, no other text):
{
  "roomType": "Bedroom",
  "designerReport": {
    "styleRationale": "A professional designer description of the chosen style concept and layout choice.",
    "lightingAnalysis": "Analysis of the natural and artificial lighting.",
    "materialPalette": [
      { "name": "Solid Walnut Wood", "rationale": "For bed frame and side tables to add grounding warmth." }
    ],
    "colorPalette": [
      { "hex": "#8B5E3C", "name": "Walnut Brown", "use": "Main furniture and accents" }
    ],
    "executionChecklist": [
      "Step 1: Clear the back wall and prepare for bed frame alignment."
    ]
  },
  "interactiveDesignZones": [
    {
      "id": "zone_1",
      "name": "Primary Bed Zone",
      "item": "King size platform bed with custom headboard",
      "description": "Center the bed against the back wall to anchor the room symmetrically. Use soft linen bedding for texture.",
      "boundingBox": [0.4, 0.2, 0.8, 0.7],
      "suggestedMarketplaceItems": ["bed", "pillow", "bedsheet"]
    }
  ],
  "imageGenerationPrompt": "A highly detailed, professional photorealistic Stable Diffusion prompt that describes the redesigned room, matching the original room geometry and elements (window/door positions) but incorporating the new styling."
}

Note: "boundingBox" must be an array of 4 floating point numbers [ymin, xmin, ymax, xmax] between 0.0 and 1.0 representing the normalized coordinates on the image where this design element should be overlaid (e.g. [0.4, 0.2, 0.8, 0.7]). Be precise with the coordinates so they map to the correct walls/floor areas in the photo!`;

    const inlineData = { inlineData: { data: base64Data, mimeType } };
    const result = await generateGeminiContent(genAI, prompt, inlineData);
    
    const text = result.response.text();
    console.log("✅ SUCCESS! Response text received:");
    console.log(text);
    
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    console.log("✅ PARSED SUCCESS! Zones count:", parsed.interactiveDesignZones.length);
    console.dir(parsed, { depth: null });
  } catch (err) {
    console.error("❌ Gemini request failed:", err.message);
  }
}

testGeminiZones();
