const axios = require('axios');
const GenerationHistory = require('../models/GenerationHistory');

const VARIATION_STYLES = [
  'Modern minimalist with clean lines, neutral tones, and functional furniture',
  'Scandinavian inspired with light woods, cozy textiles, and minimalist decor',
  'Luxury contemporary with marble accents, gold fixtures, and designer furniture',
  'Industrial chic with exposed brick, metal accents, and urban furniture',
  'Bohemian eclectic with layered textiles, warm colors, and natural elements',
  'Japanese zen with tatami mats, shoji screens, and minimal furniture',
  'Art deco glamour with geometric patterns, velvet, and brass accents',
  'Coastal calm with light blues, whitewashed wood, and airy textures',
  'Rustic farmhouse with reclaimed wood, vintage pieces, and warm lighting',
  'Mid-century modern with organic shapes, tapered legs, and retro colors'
];

const FURNITURE_VARIATIONS = {
  'Living Room': [
    'sectional sofa with ottoman, marble coffee table, floor-to-ceiling curtains',
    'loveseat with chaise, glass coffee table, floating shelves',
    'L-shaped sofa with brass-accented coffee table, built-in bookshelves',
    'velvet sofa with tufted back, crystal chandelier, gold console table',
    'leather recliner set, wooden trunk coffee table, abstract wall art'
  ],
  'Bedroom': [
    'platform bed with floating nightstands, walk-in closet system',
    'sleigh bed with matching dresser, vanity with Hollywood mirror',
    'four-poster bed with canopy, chaise lounge, ornate chandelier',
    'storage bed with hydraulic lift, wall-mounted desk, LED strip lighting',
    'low-profile platform bed with floor-to-ceiling curtains, minimalist wardrobe'
  ],
  'Kitchen': [
    'waterfall marble island with breakfast bar, pendant lighting',
    'butcher block island with farmhouse sink, open shelving',
    'kitchen island with wine storage, quartz countertops, under-cabinet lighting',
    'two-tier island with prep sink, pot filler, subway tile backsplash',
    'expanded kitchen island with seating, statement range hood, pantry wall'
  ],
  'Dining Room': [
    'extendable dining table with upholstered chairs, buffet server',
    'round pedestal table with ladder-back chairs, china cabinet',
    'glass-top dining table with velvet chairs, mirrored wall',
    'farmhouse trestle table with bench seating, rustic sideboard',
    'marble dining table with tufted chairs, statement chandelier'
  ],
  'Bathroom': [
    'floating double vanity with vessel sinks, freestanding tub',
    'smart mirror with LED, walk-in rainfall shower, heated floor',
    'wall-mounted faucets, backlit mirror, soaking tub with jets',
    'double vanity with marble top, frameless glass shower, towel warmer',
    'floating single vanity, corner soaking tub, mosaic tile floor'
  ],
  'Office Room': [
    'standing desk converter, ergonomic chair, monitor arms',
    'executive desk with hutch, leather chair, credenza',
    'L-shaped desk with keyboard tray, bookshelf, task lighting',
    'floating desk with cable management, whiteboard wall, filing cabinet',
    'collaborative desk system, rolling storage, acoustic panels'
  ],
  'Kids Room': [
    'bunk bed with stairs and storage, teepee play area',
    'captain\'s bed with desk underneath, toy storage bins',
    'trundle bed with reading nook, art station, chalkboard wall',
    'loft bed with play space underneath, bookshelf, toy bins',
    'single bed with storage drawers, study corner, soft play mat'
  ],
  'Balcony': [
    'foldable bistro set with herb planter, string lights',
    'hanging egg chair with cushion, vertical garden wall',
    'daybed with outdoor cushions, side table, lanterns',
    'corner sofa set with fire pit table, outdoor rug',
    'hammock with stand, potted plants, privacy screen'
  ],
  'Pooja Room': [
    'carved wooden mandir with brass bells, marble platform',
    'wall-mounted mandir with floating shelves, diya stand',
    'teak mandir with gold detailing, brass lamps, storage drawer',
    'traditional mandir with dome top, silk curtains, silver idols',
    'minimalist wall mandir with marble base, oil lamps, incense holder'
  ],
  'Commercial Space': [
    'reception desk with company logo, modular waiting lounge',
    'open-plan workstations with height-adjustable desks, green wall',
    'collaborative breakout area with comfortable seating, whiteboard wall',
    'glass-walled conference room with video conferencing setup',
    'co-working layout with hot desks, phone booths, cafe corner'
  ]
};

// Room-type specific fallback images — each key maps to curated, correct-room photos
const FALLBACK_IMAGES_BY_ROOM = {
  'Living Room': [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80'
  ],
  'Bedroom': [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
    'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=800&q=80'
  ],
  'Bathroom': [
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
    'https://images.unsplash.com/photo-1620626011761-996317702149?w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
  ],
  'Kitchen': [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80',
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
    'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800&q=80',
    'https://images.unsplash.com/photo-1556909075-7b1c2a5c1a8e?w=800&q=80'
  ],
  'Dining Room': [
    'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'https://images.unsplash.com/photo-1600210491892-03d54c2b2b7d?w=800&q=80',
    'https://images.unsplash.com/photo-1617104678098-de229db51175?w=800&q=80',
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80'
  ],
  'Office Room': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    'https://images.unsplash.com/photo-1593642532559-0c6d3fc62b89?w=800&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    'https://images.unsplash.com/photo-1583062150831-d95d9b4fbc3e?w=800&q=80'
  ],
  'Kids Room': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=800&q=80',
    'https://images.unsplash.com/photo-1566312922674-dc89b6a8a38e?w=800&q=80',
    'https://images.unsplash.com/photo-1617361407418-d0a3f6b5c6a1?w=800&q=80',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80'
  ],
  'Balcony': [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1558618047-f4e50e609e76?w=800&q=80',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
    'https://images.unsplash.com/photo-1602872029708-84d970d3382b?w=800&q=80',
    'https://images.unsplash.com/photo-1505254422-beb7edfc5f5b?w=800&q=80'
  ],
  'Pooja Room': [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    'https://images.unsplash.com/photo-1621570168426-ea93fca8aa0b?w=800&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    'https://images.unsplash.com/photo-1617529497471-9218633199c0?w=800&q=80',
    'https://images.unsplash.com/photo-1604014654291-e0e04e31613b?w=800&q=80'
  ],
  'Commercial Space': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80'
  ]
};

// Flat fallback list used only for legacy export compatibility
const FALLBACK_IMAGES = FALLBACK_IMAGES_BY_ROOM['Living Room'];

const HF_MODELS = [
  'stabilityai/stable-diffusion-2-1',
  'runwayml/stable-diffusion-v1-5',
  'prompthero/openjourney',
  'timbrooks/instruct-pix2pix'
];

const generateUniqueSeed = (existingSeeds = []) => {
  let seed;
  do {
    seed = Date.now() + Math.floor(Math.random() * 1000000);
  } while (existingSeeds.includes(seed));
  return seed;
};

const getVariationPrompt = (roomType, seed) => {
  const styleIndex = seed % VARIATION_STYLES.length;
  const style = VARIATION_STYLES[styleIndex];
  const furnitureOptions = FURNITURE_VARIATIONS[roomType] || FURNITURE_VARIATIONS['Living Room'];
  const furnitureIndex = Math.floor(seed / VARIATION_STYLES.length) % furnitureOptions.length;
  const furniture = furnitureOptions[furnitureIndex];
  const colorPalettes = [
    'warm earth tones with terracotta and cream accents',
    'cool blues and grays with silver highlights',
    'rich jewel tones with gold and brass accents',
    'monochrome black and white with marble textures',
    'soft pastels with natural wood and white',
    'bold primary colors with geometric patterns',
    'neutrals with pops of forest green and navy',
    'warm beige and taupe with copper accents',
    'deep burgundy and navy with gold trim',
    'light airy whites with pale wood and greenery'
  ];
  const colorIdx = Math.floor(seed / 7) % colorPalettes.length;
  const palette = colorPalettes[colorIdx];
  const lightingOptions = [
    'warm ambient lighting with layered lamps',
    'natural daylight with sheer curtains',
    'dramatic directional lighting with shadows',
    'soft diffused lighting with LED strips',
    'statement chandelier with accent spotlights'
  ];
  const lightingIdx = seed % lightingOptions.length;
  const lighting = lightingOptions[lightingIdx];
  return `Style: ${style}. Furniture: ${furniture}. Color scheme: ${palette}. Lighting: ${lighting}.`;
};

const generateImageWithAI = async ({ image, roomType, seed, variationPrompt }) => {
  const prompt = `A highly detailed, photorealistic interior design of a ${roomType}. ${variationPrompt} Professional architectural photography, 8k quality, editorial style.`;

  // Try HuggingFace models
  if (process.env.HF_API_TOKEN) {
    for (const model of HF_MODELS) {
      try {
        const modelUrl = `https://api-inference.huggingface.co/models/${model}`;
        const isInstruct = model.includes('instruct-pix2pix');
        let payload, headers;
        if (isInstruct) {
          payload = { inputs: image, parameters: { prompt, num_inference_steps: 30, guidance_scale: 7.5 } };
          headers = { 'Authorization': `Bearer ${process.env.HF_API_TOKEN}`, 'Content-Type': 'application/json' };
        } else {
          payload = { inputs: prompt, parameters: { negative_prompt: 'lowres, bad anatomy, bad quality', num_inference_steps: 25 } };
          headers = { 'Authorization': `Bearer ${process.env.HF_API_TOKEN}`, 'Content-Type': 'application/json' };
        }
        const response = await axios({ method: 'post', url: modelUrl, headers, data: payload, responseType: 'arraybuffer', timeout: 30000 });
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
          if (response.data && response.data.length > 100) {
            const generatedImageBase64 = Buffer.from(response.data, 'binary').toString('base64');
            console.log(`HF model ${model} successful with seed ${seed}`);
            return { imageUrl: `data:image/jpeg;base64,${generatedImageBase64}`, prompt };
          }
        }
      } catch (err) {
        console.warn(`HF model ${model} failed:`, err.message);
      }
    }
  }

  // Try Replicate
  if (process.env.REPLICATE_API_TOKEN) {
    try {
      const Replicate = require('replicate');
      const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
      const output = await replicate.run(
        'jagilley/controlnet-hough:854e87270c1a024da3cdbc569aa1f807205a2786725227f272a806ea95d6771e',
        {
          input: {
            image,
            prompt: `A beautiful interior design of a ${roomType}, ${variationPrompt} photorealistic, 8k`,
            num_samples: '1', image_resolution: '512',
            a_prompt: 'best quality, extremely detailed',
            n_prompt: 'longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality'
          }
        }
      );
      if (output && output.length > 0) {
        const imageUrl = output.length > 1 ? output[1] : output[0];
        console.log('Replicate generation successful with seed', seed);
        return { imageUrl, prompt };
      }
    } catch (err) {
      console.warn('Replicate generation failed:', err.message);
    }
  }

  // Try Pollinations AI
  try {
    const layoutDesc = `with ${variationPrompt}`;
    const encodedPrompt = encodeURIComponent(`A highly detailed, modern, photorealistic interior design of a ${roomType} ${layoutDesc}, architectural digest, beautiful lighting, 8k resolution`);
    const response = await axios.get(
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${seed}&nologo=true`,
      { responseType: 'arraybuffer', timeout: 30000 }
    );
    if (!response.data || response.data.length === 0) {
      throw new Error('Pollinations returned empty response');
    }
    const generatedImageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:image/jpeg;base64,${generatedImageBase64}`;
    console.log('Pollinations generation successful with seed', seed);
    return { imageUrl, prompt };
  } catch (err) {
    console.warn('Pollinations generation failed:', err.message);
    throw new Error('All AI generation services failed.');
  }
};

const generateOneImage = async ({ image, roomType, seed, existingSeeds = [] }) => {
  const actualSeed = seed || generateUniqueSeed(existingSeeds);
  const variationPrompt = getVariationPrompt(roomType, actualSeed);
  try {
    const result = await generateImageWithAI({ image, roomType, seed: actualSeed, variationPrompt });
    return { seed: actualSeed, imageUrl: result.imageUrl, prompt: result.prompt, variationPrompt, success: true };
  } catch (err) {
    console.warn('Image generation failed, using fallback:', err.message);
    // Pick a room-specific fallback so the image always matches the selected room type
    const roomFallbacks = FALLBACK_IMAGES_BY_ROOM[roomType] || FALLBACK_IMAGES_BY_ROOM['Living Room'];
    return { seed: actualSeed, imageUrl: roomFallbacks[actualSeed % roomFallbacks.length], prompt: `Fallback: ${variationPrompt}`, variationPrompt, success: false };
  }
};

const generateMultipleImages = async ({ image, roomType, count = 5, existingSeeds = [] }) => {
  const seedsInUse = [...existingSeeds];
  const promises = [];
  for (let i = 0; i < count; i++) {
    const seed = generateUniqueSeed(seedsInUse);
    seedsInUse.push(seed);
    promises.push(generateOneImage({ image, roomType, seed, existingSeeds: seedsInUse }));
  }
  return Promise.all(promises);
};

exports.generateAIImage = async (req, res) => {
  try {
    const { image, roomType } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required.' });
    }
    const seed = generateUniqueSeed();
    const variationPrompt = getVariationPrompt(roomType || 'Living Room', seed);
    const result = await generateImageWithAI({ image, roomType: roomType || 'Living Room', seed, variationPrompt });
    res.status(200).json({ success: true, imageUrl: result.imageUrl, roomType, seed, variationPrompt, promptUsed: result.prompt });
  } catch (error) {
    console.error('AI Generation Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate AI image', error: error.message });
  }
};

exports.saveGeneration = async ({ userId, projectId, uploadedImage, generatedImage, roomType, designStyle, promptUsed, seed, versionNumber }) => {
  const generation = await GenerationHistory.create({
    userId, projectId, uploadedImage, generatedImage, roomType,
    designStyle: designStyle || VARIATION_STYLES[seed % VARIATION_STYLES.length],
    promptUsed, seed, variationPrompt: getVariationPrompt(roomType, seed), versionNumber
  });
  return generation;
};

exports.generateUniqueSeed = generateUniqueSeed;
exports.getVariationPrompt = getVariationPrompt;
exports.generateImageWithAI = generateImageWithAI;
exports.generateOneImage = generateOneImage;
exports.generateMultipleImages = generateMultipleImages;
exports.VARIATION_STYLES = VARIATION_STYLES;
exports.FALLBACK_IMAGES = FALLBACK_IMAGES;
