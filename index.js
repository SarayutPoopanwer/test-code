const mongoose = require('mongoose');

// URL สำหรับเชื่อมต่อกับ MongoDB (เปลี่ยน 'localhost:27017' และ 'test' เป็นค่าที่เหมาะสมกับการตั้งค่าของคุณ)
const mongoURL = 'mongodb+srv://sarayutpoo:4bVGYdz9oCNQmDgF@cluster0.qrth7pb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// เชื่อมต่อกับ MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


// สร้าง Schema สำหรับเก็บข้อมูลพิกัด
const locationSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
});

// สร้าง Model จาก Schema
const Location = mongoose.model('Location', locationSchema);


// เพิ่มข้อมูลพิกัดลงใน MongoDB
const addLocation = async () => {
  const newLocation = new Location({
    name: 'ศรายุทธ ภูพันเว่อ',
    latitude: 643020178703434,
    longitude: 6430201787,
  });

  try {
    const savedLocation = await newLocation.save();
    console.log('Location saved:', savedLocation);
  } catch (err) {
    console.error('Error saving location:', err);
  }
};

// เรียกใช้ฟังก์ชัน addLocation
addLocation();


// ดึงข้อมูลพิกัดทั้งหมดจาก MongoDB
const getLocations = async () => {
  try {
    const locations = await Location.find({});
    console.log('Locations found:', locations);
  } catch (err) {
    console.error('Error getting locations:', err);
  }
};

// เรียกใช้ฟังก์ชัน getLocations
getLocations();
