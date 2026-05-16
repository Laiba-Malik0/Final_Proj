const express = require('express');
const router = express.Router();
const Car = require('../models/Car'); 
const { getAllCars, createCar, deleteCar } = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware'); 
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Public route
router.get('/', getAllCars);

// Protected routes (Login zaroori hai)
// --- 1. POST ROUTE UPDATE: upload.single('image') add kar diya ---
router.post('/', authMiddleware, upload.single('image'), createCar);

// --- 2. PUT ROUTE UPDATE: Yahan bhi image update handle karne ke liye upload.single lagaya ---
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    let updateData = { ...req.body };

    // to slect new file during reuploading
    if (req.file) {
      const cloudinary = require('cloudinary').v2;
      const fileBase64 = req.file.buffer.toString('base64');
      const fileDataUri = `data:${req.file.mimetype};base64,${fileBase64}`;
      
      const uploadResponse = await cloudinary.uploader.upload(fileDataUri, {
        folder: 'carzone_beasts'
      });
      updateData.image = uploadResponse.secure_url;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedCar) return res.status(404).json({ message: "Car not found" });
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, deleteCar);

module.exports = router;