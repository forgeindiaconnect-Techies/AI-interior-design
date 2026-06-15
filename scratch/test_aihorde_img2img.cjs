const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function testHordeImg2Img() {
  console.log("Loading sample image...");
  const imgPath = path.join(__dirname, '../bedroom/modern/bedroom_modern_0.jpg');
  if (!fs.existsSync(imgPath)) {
    console.error("❌ Sample image does not exist at:", imgPath);
    return;
  }
  
  const base64Image = fs.readFileSync(imgPath).toString('base64');
  
  const payload = {
    prompt: "A beautiful, premium, Scandinavian-style modern bedroom, high quality, photorealistic, professional interior photography, light wood furniture, cozy textiles, warm lighting",
    params: {
      steps: 25,
      denoising_strength: 0.65, // Preserve structure but add design
      width: 512,
      height: 512,
      cfg_scale: 7.5
    },
    source_image: base64Image,
    source_processing: "img2img"
  };

  try {
    console.log("Submitting job to AI Horde...");
    const res = await axios.post('https://stablehorde.net/api/v2/generate/async', payload, {
      headers: {
        'apikey': '0000000000',
        'Client-Agent': 'AI-Interior-Designer:1.0.0:test@example.com',
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });
    
    const jobId = res.data.id;
    console.log("✅ Job submitted successfully. Job ID:", jobId);
    
    // Poll the status
    let done = false;
    let attempts = 0;
    while (!done && attempts < 30) {
      attempts++;
      console.log(`Polling job status (Attempt ${attempts})...`);
      const statusRes = await axios.get(`https://stablehorde.net/api/v2/generate/status/${jobId}`, {
        headers: {
          'Client-Agent': 'AI-Interior-Designer:1.0.0:test@example.com'
        }
      });
      
      const statusData = statusRes.data;
      if (statusData.done) {
        done = true;
        console.log("✅ Job completed!");
        if (statusData.generations && statusData.generations.length > 0) {
          const gen = statusData.generations[0];
          // AI Horde returns image as web URL or base64? Let's check
          console.log("Generation data keys:", Object.keys(gen));
          if (gen.img) {
            // It could be a base64 string or a URL. AI Horde returns base64 or URL depending on config.
            const imgBuffer = gen.img.startsWith('http') 
              ? (await axios.get(gen.img, { responseType: 'arraybuffer' })).data
              : Buffer.from(gen.img, 'base64');
            const outPath = path.join(__dirname, 'horde_img2img_output.webp');
            fs.writeFileSync(outPath, imgBuffer);
            console.log(`✅ Success! Generated image saved to: ${outPath} (${imgBuffer.length} bytes)`);
          } else {
            console.log("❌ No image data found in generation result.");
          }
        } else {
          console.log("❌ No generations returned.");
        }
      } else {
        console.log(`Job in progress. Wait count: ${statusData.wait_time}s, Queue position: ${statusData.queue_position}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  } catch (err) {
    console.error("❌ AI Horde request failed:", err.message);
    if (err.response) {
      console.error("Details:", JSON.stringify(err.response.data));
    }
  }
}

testHordeImg2Img();
