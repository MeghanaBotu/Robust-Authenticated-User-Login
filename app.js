const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


const url = 'mongodb://127.0.0.1:27017';
const dbName = 'mydb';
const client = new MongoClient(url, { useUnifiedTopology: true });

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection('users');

       
        const hashedPassword = await bcrypt.hash(password, 10);

        
        await users.insertOne({ username, password: hashedPassword });

        res.send('Login details stored successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
