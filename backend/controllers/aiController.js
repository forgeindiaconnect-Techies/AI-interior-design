const axios = require('axios');

// @desc    Generate AI image using Hugging Face image-to-image model
// @route   POST /api/ai/generate
// @access  Public/Private (depending on route configuration)
exports.generateAIImage = async (req, res) => {
  try {
    const { image, roomType } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required.' });
    }

    if (!process.env.HF_API_TOKEN) {
      return res.status(500).json({ success: false, message: 'Hugging Face API token is missing in .env' });
    }

    // Default prompt based on room type
    const prompt = `A highly detailed, modern, photorealistic interior design of a ${roomType || 'room'}, professional lighting, 8k resolution`;

    // Process base64 image (remove data URI scheme prefix if present)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Define Hugging Face model URL
    // instruct-pix2pix is excellent for modifying images based on text instructions
    const modelUrl = 'https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix';

    // The Hugging Face inference API for image-to-image can be quite specific depending on the model.
    // For many models, sending the image as binary and passing the prompt in a custom header or via JSON works.
    // A robust approach for text-guided image-to-image via standard Inference API:
    // Some models accept JSON with inputs as image and parameters.prompt. 
    // If we send it as binary, we might not be able to send the prompt easily unless using multipart.
    // Let's use the common JSON payload approach which many HF pipelines support for base64 inputs.
    
    // We will attempt to send standard JSON payload.
    // If the model expects binary, you would pass `data: imageBuffer` and set Content-Type to application/octet-stream.
    
    const payload = {
      inputs: image, // Passing the base64 string
      parameters: {
        prompt: prompt,
        num_inference_steps: 30,
        guidance_scale: 7.5
      }
    };

    const response = await axios({
      method: 'post',
      url: modelUrl,
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: payload,
      responseType: 'arraybuffer' // Expect binary image data back
    });

    // Check if the response is actually JSON (which happens if there's an error like model loading)
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      const jsonString = Buffer.from(response.data).toString('utf8');
      const errorData = JSON.parse(jsonString);
      return res.status(500).json({ 
        success: false, 
        message: 'Hugging Face API Error', 
        error: errorData 
      });
    }

    // Convert returned binary image to base64
    const generatedImageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    const generatedImageUrl = `data:image/jpeg;base64,${generatedImageBase64}`;

    res.status(200).json({
      success: true,
      imageUrl: generatedImageUrl,
      roomType: roomType
    });

  } catch (error) {
    console.error('AI Generation Error:', error.message);
    
    // Attempt to extract more details from axios error response
    let errorMessage = error.message;
    if (error.response && error.response.data) {
      try {
        const errorJson = JSON.parse(Buffer.from(error.response.data).toString('utf8'));
        errorMessage = errorJson.error || errorMessage;
      } catch (e) {
        // If it's not JSON, ignore
      }
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate AI image', 
      error: errorMessage 
    });
  }
};
