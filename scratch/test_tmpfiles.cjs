async function testTmpFiles() {
  console.log("Testing upload to tmpfiles.org using native fetch...");
  
  // Create a 1x1 dummy PNG buffer
  const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const buffer = Buffer.from(base64Data, 'base64');
  const blob = new Blob([buffer], { type: 'image/png' });
  
  const formData = new FormData();
  formData.append('file', blob, 'test.png');

  try {
    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData
    });
    
    console.log("✅ Upload response status:", res.status);
    const data = await res.json();
    console.log("✅ Upload response data:", JSON.stringify(data));
    
    if (data && data.data && data.data.url) {
      const uploadUrl = data.data.url;
      // Convert view URL to download URL
      const directUrl = uploadUrl.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
      console.log("✅ Direct public URL:", directUrl);
    }
  } catch (err) {
    console.error("❌ TmpFiles Upload failed:", err.message);
  }
}

testTmpFiles();
