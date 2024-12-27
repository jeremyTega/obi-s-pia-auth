const mongoose = require('mongoose')
require('dotenv').config()

const link = process.env.url

mongoose.connect(link)
    .then(() => {
        console.log('Connected to MongoDB successfully');

       
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
    