const { mongoose } = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
});

const imageModel = mongoose.model('Image', imageSchema);
module.exports = { imageModel };