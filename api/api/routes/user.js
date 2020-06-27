const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', (req, res, next) => {
    User.find({ username: req.body.username })
        .then(userArray => {
            if (userArray.length == 0) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            username: req.body.username,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(200).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: err.message
                                });
                            });
                    }
                });
            } else {
                res.status(500).json({
                    message: 'username already exists'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        });
});

router.get('/leaderboard', (req, res, next) => {
    User.aggregate([
        { $sort: { level: -1, updatedAt: 1 } }
    ]).then(users => {
        var userArray = [];
        for (var i = 0; i < users.length; i++) {
            userArray[i] = {
                username: users[i].username,
                level: users[i].level
            };
        }
        res.status(200).json(userArray);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
});

router.post('/details', checkAuth, (req, res, next) => {
    const username = req.username;
    User.findOne({ username: username })
        .then(user => {
            res.status(200).json({
                username: user.username,
                level: user.level
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        });
});

router.post('/login', (req, res, next) => {
    console.log(req.body.username);
    console.log(req.body.password);
    User.find({ username: req.body.username })
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Username or Password not correct. Try Again.'
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        res.status(401).json({
                            message: 'Username or Password not correct. Try Again.'
                        });
                    }
                    if (result) {
                        const token = jwt.sign({
                            username: user[0].username,
                            userId: user[0]._id
                        },
                            "padamchopraisgreatandhecofoundedtechsyndicate",
                            {
                                expiresIn: "12h"
                            });
                        res.status(200).json({
                            message: 'Auth successful',
                            token: token
                        });
                    } else {
                        res.status(401).json({
                            message: 'Username or Password not correct. Try Again.'
                        });
                    }
                });
            }
        })
        .catch(err => {
            res.status(401).json({
                message: "Username or Password not correct. Try Again."
            });
        });
});

module.exports = router;
