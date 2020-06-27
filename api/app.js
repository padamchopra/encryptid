const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const questionRoutes = require('./api/routes/questions');
const answerRoutes = require('./api/routes/answers');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://root:machinelearn1ng@cluster0-tnury.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/user', userRoutes);
app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);

app.use((req, res, next) => {
    res.status(200).json({
        message: 'Route Not Found'
    });
});

module.exports = app;