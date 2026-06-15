async function getModels() {
  try {
    const res = await fetch('https://image.pollinations.ai/models');
    const data = await res.json();
    console.log("✅ Models:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Failed to fetch models:", err.message);
  }
}

getModels();
