const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tetris', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define schemas and models as needed

// Example user schema
const userSchema = new mongoose.Schema({
    username: String,
    highScore: Number,
});

const User = mongoose.model('User', userSchema);


app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post('/users', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json(newUser);
});

