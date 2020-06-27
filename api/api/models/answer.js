const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    level: Number,
    answer: String,
});

module.exports = mongoose.model('Answer', answerSchema);