const express = require('express');
const { initializeDatabase } = require('./db.connect');
const { imageModel } = require('./models/images');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initializeDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({});
const upload = multer({ storage });

app.get("/", (req, res) => {
    res.send("Welcome to the Image Upload API");
});

app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
  return res.status(400).json({ error: "No file uploaded" });
}
        
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "uploads",
        });
        const newImage = new imageModel({ imageUrl: result.secure_url });
        await newImage.save();
        res.status(200).json({ message: "Image uploaded successfully", imageUrl: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading image", error: error.message });
    }
});

app.get("/images", async (req, res) => {
    try {
        const images = await imageModel.find();
        res.status(200).json(images);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching images", error: error.message }); 
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});