require('dotenv').config();
const axios = require('axios');

async function testHuggingFace() {
  console.log("🔍 Testing Hugging Face API connection...");
  
  const token = process.env.HF_API_TOKEN;
  if (!token) {
    console.error("❌ ERROR: No HF_API_TOKEN found in your .env file.");
    return;
  }

  console.log("✅ Token found. Attempting to connect to Hugging Face...");

  // We will test the instruct-pix2pix model using a tiny 1x1 pixel base64 image
  const dummyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  
  const payload = {
    inputs: dummyImage,
    parameters: {
      prompt: "make it a modern room",
      num_inference_steps: 1
    }
  };

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: payload,
      responseType: 'arraybuffer'
    });

    console.log(`✅ SUCCESS! Hugging Face is working.`);
    console.log(`📦 Received response of size: ${response.data.byteLength} bytes.`);
    console.log(`If this was a real image, it would now be sent to your frontend.`);

  } catch (error) {
    console.error("❌ ERROR: Hugging Face API request failed.");
    if (error.response) {
      console.error(`Status Code: ${error.response.status}`);
      try {
        const errorJson = JSON.parse(Buffer.from(error.response.data).toString('utf8'));
        console.error("Details:", errorJson);
      } catch(e) {
        console.error("Details:", error.response.statusText);
      }
    } else {
      console.error(error.message);
    }
  }
}

testHuggingFace();
