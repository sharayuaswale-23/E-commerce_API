require('dotenv').config();
const express = require('express');
const app = express();
const userRoute = require('./api/routes/user');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const { MONGO_URI, PORT } = require('./config');


mongoose.connect(MONGO_URI);

mongoose.connection.on('error',err=>{
    console.log('Connection failed');
})


mongoose.connection.on('connected',connected=>{
    console.log('Connected with database..');
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoute);

app.use((req,res,next)=>{
    res.status(404).json({
        Error: "Bad request"
    })
})

module.exports = app;