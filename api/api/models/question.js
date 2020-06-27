const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    level: Number,
    questiontext: String,
    hint: String
});

module.exports = mongoose.model('Question', questionSchema);
