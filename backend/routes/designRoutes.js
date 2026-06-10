const express = require('express');
const router = express.Router();
const { 
  createAIDesign, 
  getUserAIDesigns, 
  updateAIDesignStatus,
  deleteAIDesign,
  createManualDesign,
  getUserManualDesigns,
  createDesignerRequest,
  getAIDesignGenerations
} = require('../controllers/designController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ai', protect, createAIDesign);
router.get('/ai', protect, getUserAIDesigns);
router.put('/ai/:id', protect, updateAIDesignStatus);
router.delete('/ai/:id', protect, deleteAIDesign);
router.get('/ai/:id/generations', protect, getAIDesignGenerations);

router.post('/manual', protect, createManualDesign);
router.get('/manual', protect, getUserManualDesigns);

router.post('/designer', protect, createDesignerRequest);

module.exports = router;
