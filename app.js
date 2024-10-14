const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // เพิ่ม ObjectId สำหรับการลบข้อมูล
const bodyParser = require('body-parser'); // เพิ่ม body-parser สำหรับรับข้อมูลจากฟอร์ม
const app = express();
const port = process.env.PORT;

// ตั้งค่า EJS เป็น template engine
app.set('view engine', 'ejs');

// ใช้ body-parser เพื่อรับข้อมูลจากฟอร์ม
app.use(bodyParser.urlencoded({ extended: true }));

// URL สำหรับเชื่อมต่อกับ MongoDB
const mongoURL = 'mongodb+srv://sarayutpoo:4bVGYdz9oCNQmDgF@cluster0.qrth7pb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(mongoURL);

// ชื่อของฐานข้อมูลและ collection ที่ต้องการใช้
const dbName = 'test';
const collectionName = 'geojsons';

// ดึงข้อมูลจาก MongoDB และแสดงผลบนหน้าเพจ
app.get('/', async (req, res) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // ดึงข้อมูลทั้งหมดจาก collection
        const data = await collection.find({}).toArray();

        // ส่งข้อมูลไปยัง view เพื่อแสดงผล
        res.render('index', { data: data });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

// ฟังก์ชันเพิ่มข้อมูล
app.post('/add', async (req, res) => {
    const { name, location, tel, age } = req.body;

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // เพิ่มข้อมูลใหม่เข้าไปใน collection
        await collection.insertOne({ name: name, location: location, tel: tel, age: age });

        res.redirect('/'); // กลับไปยังหน้าหลักหลังจากเพิ่มข้อมูล
    } catch (error) {
        console.error('Error adding data to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

// ฟังก์ชันลบข้อมูล
app.post('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // ลบข้อมูลตาม id
        await collection.deleteOne({ _id: new ObjectId(id) });

        res.redirect('/'); // กลับไปยังหน้าหลักหลังจากลบข้อมูล
    } catch (error) {
        console.error('Error deleting data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
