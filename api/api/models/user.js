const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    level: { type: Number, default: 0 },
}, {
        timestamps: true
    });

module.exports = mongoose.model('User', userSchema);
