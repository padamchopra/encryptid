const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/question');
const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');

router.post('/', checkAuth, (req, res, next) => {
    const username = req.username;
    User.findOne({ username: username })
        .then(user => {
            const level = user.level;
            Question.find({ level: level }).limit(1)
                .then(result => {
                    res.status(200).json({
                        question: result[0].questiontext,
                        hint: result[0].hint
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: "Level not yet created. Contact admin."
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                message: "Could not get question. Try Again."
            });
        });
});

router.post('/create', (req, res, next) => {
    const question = new Question({
        level: req.body.level,
        questiontext: req.body.questiontext,
        hint: req.body.hint
    });
    question.save().then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });
    res.status(200).json({
        message: 'Handling post requests to /questions',
        createdQuestion: question
    })
});

module.exports = router;