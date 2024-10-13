const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // To load environment variables from a .env file

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable CORS for cross-origin requests

// MongoDB URL from environment variables (set in Render.com or in a .env file)
const mongoURL = process.env.MONGODB_URI || 'mongodb+srv://sarayutpoo:4bVGYdz9oCNQmDgF@cluster0.qrth7pb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
}).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the application if the database connection fails
});

// Define a Mongoose Schema for storing GeoJSON (or any other data)
const geoJsonSchema = new mongoose.Schema({
    type: { type: String, required: true },  // 'FeatureCollection'
    features: [
        {
            type: { type: String, required: true },  // 'Feature'
            geometry: {
                type: { type: String, required: true },  // 'Point', 'Polygon', etc.
                coordinates: { type: [Number], required: true }  // [longitude, latitude]
            },
            properties: { type: Object, required: false }  // Optional additional properties
        }
    ]
});

// Create a Mongoose Model from the Schema
const GeoJson = mongoose.model('GeoJson', geoJsonSchema);

// POST request to handle incoming data at root "/"
app.post('/', async (req, res) => {
    console.log("Received data:", req.body);  // Log the received data
    const geoJsonData = req.body;

    try {
        const newGeoJson = new GeoJson(geoJsonData); // Create a new document from the received data
        const savedGeoJson = await newGeoJson.save(); // Save to MongoDB
        res.status(201).json(savedGeoJson);  // Respond with the saved document
    } catch (err) {
        console.error('Error saving data:', err.message);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// GET request to retrieve all data from MongoDB
app.get('/', async (req, res) => {
    try {
        const geoJsonRecords = await GeoJson.find({});  // Fetch all records from MongoDB
        res.json(geoJsonRecords);  // Respond with the fetched data
    } catch (err) {
        console.error('Error fetching data:', err.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start the server on port 8080 or the port defined in the environment
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
