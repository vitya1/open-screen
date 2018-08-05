const mongoose = require('mongoose');

const screen_schema = mongoose.Schema({
    hash: String,
    url: String,
    image_path: String,
    image_hash: String,
    creator_ip: String,
    creation_date: Number,
    blockchain_id: Number,
    transaction_id: String,
    transaction_data: String
});

module.exports = mongoose.model('Screen', screen_schema);
