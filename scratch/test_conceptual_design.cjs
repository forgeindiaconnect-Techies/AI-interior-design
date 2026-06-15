const path = require('path');
const mongoose = require('mongoose');
const User = require('../backend/models/User');
const AIDesignRequest = require('../backend/models/AIDesignRequest');
const { createAIDesign } = require('../backend/controllers/designController');

async function runTest() {
  console.log("Starting Conceptual AI Design integration test...");
  
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is not defined in backend/.env!");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully.");

    let testUser = await User.findOne();
    if (!testUser) {
      testUser = await User.create({
        name: "Test Pipeline User",
        email: `test_pipeline_${Date.now()}@example.com`,
        password: "Password123!",
        role: "customer"
      });
    }

    const req = {
      user: { id: testUser._id.toString() },
      body: {
        roomType: "Bathroom",
        originalImage: null
      },
      get: function(header) { return "localhost:5000"; },
      protocol: "http"
    };

    let responseData = null;
    let responseStatus = null;

    const res = {
      status: function(code) {
        responseStatus = code;
        return this;
      },
      json: function(data) {
        responseData = data;
        return this;
      }
    };

    console.log("Executing createAIDesign with empty originalImage...");
    await createAIDesign(req, res);

    console.log(`Response Status: ${responseStatus}`);
    console.log("Response Success:", responseData?.success);

    if (responseData?.success) {
      const designDoc = responseData.data;
      console.log("Full responseData.data:", JSON.stringify(designDoc, null, 2));
      console.log("Saved Design Request Document ID:", designDoc._id);
      
      const analysis = designDoc.analysis;
      console.log("Analysis Structure Check:");
      console.log("- detectedRoomType:", analysis.detectedRoomType);
      console.log("- generatedImage:", designDoc.generatedImage);
      
      console.log("\n--- DESIGNER REPORT ---");
      console.log("- styleRationale:", analysis.designerReport?.styleRationale ? "PASS" : "FAIL");
      console.log("- lightingAnalysis:", analysis.designerReport?.lightingAnalysis ? "PASS" : "FAIL");
      console.log("- colorPalette swatches count:", analysis.designerReport?.colorPalette?.length || 0);
      console.log("- materialPalette items count:", analysis.designerReport?.materialPalette?.length || 0);
      console.log("- executionChecklist steps count:", analysis.designerReport?.executionChecklist?.length || 0);
      
      console.log("\n--- INTERACTIVE DESIGN ZONES ---");
      console.log("- zones count:", analysis.interactiveDesignZones?.length || 0);
      if (analysis.interactiveDesignZones && analysis.interactiveDesignZones.length > 0) {
        const zone = analysis.interactiveDesignZones[0];
        console.log("- Zone 0 Name:", zone.name);
        console.log("- Zone 0 BoundingBox:", zone.boundingBox);
      }

      if (analysis.designerReport && analysis.interactiveDesignZones && analysis.interactiveDesignZones.length > 0) {
        console.log("\n🎉 TEST SUCCESSFUL! Conceptual design flow completed and persisted.");
      } else {
        console.error("\n❌ TEST FAILED: Missing structured analysis properties!");
      }
    } else {
      console.error("\n❌ TEST FAILED: Controller returned error response:", responseData?.message);
    }

  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

runTest();
