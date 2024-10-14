// mongodb+srv://sarayutpoo:4bVGYdz9oCNQmDgF@cluster0.qrth7pb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // To handle CORS issues if necessary

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable CORS for cross-origin requests

// MongoDB URL - replace with your MongoDB URI
const mongoURL = 'mongodb+srv://sarayutpoo:4bVGYdz9oCNQmDgF@cluster0.qrth7pb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a Mongoose Schema for storing GeoJSON
const geoJsonSchema = new mongoose.Schema({
    type: { type: String, required: true },  // 'FeatureCollection'
    features: [
        {
            type: { type: String, required: true },  // 'Feature'
            geometry: {
                type: { type: String, required: true },  // 'Point'
                coordinates: { type: [Number], required: true }  // [longitude, latitude]
            },
            properties: { type: Object, required: false }  // Optional additional properties
        }
    ]
});

// Create a Mongoose Model from the Schema
const GeoJson = mongoose.model('GeoJson', geoJsonSchema);

app.post('/', async (req, res) => {
  console.log("Received marker data:", req.body);  // Log the data received
  const geoJsonData = req.body;

  try {
      const newGeoJson = new GeoJson(geoJsonData); // Create a new document from the received data
      const savedGeoJson = await newGeoJson.save(); // Save to MongoDB
      res.status(201).json(savedGeoJson);  // Respond with the saved document
  } catch (err) {
      console.error('Error saving GeoJSON:', err);
      res.status(500).json({ error: 'Failed to save GeoJSON' });
  }
});

// API to retrieve all stored GeoJSON data (GET /geojson)
app.get('/', async (req, res) => {
    try {
        const geoJsonRecords = await GeoJson.find({});  // Fetch all GeoJSON records
        res.json(geoJsonRecords);  // Respond with the data
    } catch (err) {
        console.error('Error fetching GeoJSON:', err);
        res.status(500).json({ error: 'Failed to fetch GeoJSON' });
    }
});

// Start the server on port 3000
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
