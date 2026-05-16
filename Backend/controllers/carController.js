const Car = require('../models/Car');
const cloudinary = require('cloudinary').v2;

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
    cloud_name: 'dagvijeyz',
    api_key: '596448323353271',
    api_secret: 'Q-GVXM2R62bepj58fxJYJqJOEJI'
});

// 1. GET ALL CARS
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cars", error: error.message });
    }
};

// 2. CREATE NEW CAR (With Cloudinary Upload)
const createCar = async (req, res) => {
    try {
        const { name, model, price } = req.body;
        let imageUrl = req.body.image; // Default fallback agar direct link ho

        // Agar frontend se file upload hoke aayi hai (Memory Storage)
        if (req.file) {
            // File ko base64 format mein convert karna taakay Cloudinary accept kare
            const fileBase64 = req.file.buffer.toString('base64');
            const fileDataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

            // Cloudinary uploading process
            const uploadResponse = await cloudinary.uploader.upload(fileDataUri, {
                folder: 'carzone_beasts'
            });

            imageUrl = uploadResponse.secure_url; // Cloudinary se aane wala premium chota URL
        }

        const newCar = new Car({
            name,
            model,
            price,
            image: imageUrl, // image link of dtabase
            createdBy: req.user.id
        });

        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(400).json({ message: "Error saving car", error: error.message });
    }
};

// 3. DELETE CAR
const deleteCar = async (req, res) => {
    try {
        const carId = req.params.id;
        await Car.findByIdAndDelete(carId);
        res.status(200).json({ message: "Car removed from garage!" });
    } catch (error) {
        res.status(500).json({ message: "Could not delete", error: error.message });
    }
};

module.exports = { getAllCars, createCar, deleteCar };