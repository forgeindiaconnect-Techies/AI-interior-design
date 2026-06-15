const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function runTest() {
  console.log("Sleeping 40 seconds to clear rate limits...");
  await new Promise(resolve => setTimeout(resolve, 40000));
  
  const apiKey = 'AIzaSyANShxF6KAa_NYoqRF3ei2oZ_AGBjJzfK0';
  const imgPath = path.join(__dirname, '../bedroom/modern/bedroom_modern_0.jpg');
  const base64Data = fs.readFileSync(imgPath).toString('base64');
  const mimeType = 'image/jpeg';
  const inlineData = { inlineData: { data: base64Data, mimeType } };

  const genAI = new GoogleGenerativeAI(apiKey);
  // Try gemini-2.0-flash-lite first
  const modelName = "gemini-2.0-flash-lite";
  console.log(`Sending image analysis request to ${modelName}...`);
  
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

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent([prompt, inlineData]);
    console.log("✅ SUCCESS!");
    console.log(result.response.text());
  } catch (err) {
    console.error("❌ FAILED:", err.message);
  }
}

runTest();
