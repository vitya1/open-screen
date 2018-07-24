const mongoose = require('mongoose');

const screen_schema = mongoose.Schema({
    hash: String,
    url: String,
    image_path: String,
    image_hash: String,
    creator_ip: String,
    creation_date: Number,
    transaction_id: String,
    blockchain_id: Number,
});

module.exports = mongoose.model('Screen', screen_schema);
