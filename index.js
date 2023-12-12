const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

const connect=mongoose.connect(`mongodb://localhost:27017/RegistrationForm`);

 connect.then(()=>{
    console.log("Connected to MongoDB");
})
.catch(()=>{
    console.error("Couldn't connect to MongoDB");
});

app.use(express.static('public'));

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('users', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/",(req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.post('/signup', async (req, res) => {
    try{
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({email : email});

    if (!existingUser){
    const registrationData = new User({
        username,
        email,
        password
    });
    await registrationData.save();
    res.redirect('success');
    
    }
     else{
     res.redirect('error');
    }
    }
     catch(error){
     res.redirect('error');
    }
})  

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/views/success.html');
});

app.get('/error', (req, res) => {
        res.sendFile(__dirname + '/views/error.html');
    });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
