const fs = require('fs');
const path = require('path');

async function testPollinationsImg2Img() {
  console.log("Uploading sample image to tmpfiles.org...");
  const imgPath = path.join(__dirname, '../bedroom/modern/bedroom_modern_0.jpg');
  
  if (!fs.existsSync(imgPath)) {
    console.error("❌ Sample image does not exist at path:", imgPath);
    return;
  }
  
  const buffer = fs.readFileSync(imgPath);
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  
  const formData = new FormData();
  formData.append('file', blob, 'bedroom_modern_0.jpg');

  try {
    const uploadRes = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData
    });
    
    const uploadData = await uploadRes.json();
    if (!uploadData || !uploadData.data || !uploadData.data.url) {
      console.error("❌ Upload failed:", JSON.stringify(uploadData));
      return;
    }
    
    const directUrl = uploadData.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
    console.log("✅ Public image URL:", directUrl);
    
    const prompt = "A highly detailed scandinavian style modern bedroom with light wood furniture, Cozy textiles and indoor plants, 8k resolution, photorealistic, professional interior photography";
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Add the image parameter to Pollinations AI url
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=42&nologo=true&image=${encodeURIComponent(directUrl)}`;
    console.log("Fetching from Pollinations AI url:", pollinationsUrl);
    
    const pollinationsRes = await fetch(pollinationsUrl);
    if (!pollinationsRes.ok) {
      console.error(`❌ Pollinations AI request failed with status: ${pollinationsRes.status}`);
      return;
    }
    
    const imageBuffer = Buffer.from(await pollinationsRes.arrayBuffer());
    const outPath = path.join(__dirname, 'output_img2img.jpg');
    fs.writeFileSync(outPath, imageBuffer);
    console.log(`✅ SUCCESS! Saved generated image to: ${outPath} (${imageBuffer.length} bytes)`);
  } catch (err) {
    console.error("❌ Error during test:", err.message);
  }
}

testPollinationsImg2Img();
