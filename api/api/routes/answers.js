const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Answer = require('../models/answer');
const User = require('../models/user');

router.post('/', checkAuth, (req, res, next) => {
    User.findOne({ username: req.username })
        .then(user => {
            const level = user.level;
            Answer.find({ level: level }).limit(1)
                .then(result => {
                    if (result.length == 0) {
                        res.status(500).json({
                            message: "Level does not exist"
                        });
                    } else {
                        const correctAnswer = result[0].answer;
                        const givenAnswer = req.body.givenAnswer;
                        if (correctAnswer == givenAnswer) {
                            User.updateOne({ username: req.username }, {
                                level: level + 1
                            }, (err, data) => {
                                console.log(err);
                                console.log(data);
                            });
                            res.status(200).json({
                                result: "correct",
                                level: level + 1
                            });
                        } else {
                            res.status(200).json({
                                result: "wrong",
                                level: level
                            });
                        }
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        message: err.message
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        });
});

router.post('/create', (req, res, next) => {
    const answer = new Answer({
        level: req.body.level,
        answer: req.body.answer
    });
    answer.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Answer was created',
            answerCreated: answer
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Answer could not be created',
            error: err.message
        });
    });
});

module.exports = router;