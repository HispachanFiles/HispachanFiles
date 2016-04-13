/**
 * Hispachan Files
 * 
 * Modelo de mongoose para hilos
 */
'use strict';
const mongoose = require('mongoose');

module.exports = mongoose.model('Thread', {
    board: String,
    subject: String,
    postId: Number,
    posterName: String,
    posterCountry: String,
    posterCountryName: String,
    flag: String,
    date: Date,
    lastUpdate: { type: Date, default: Date.now },
    dado: String,
    message: String,
    file: {
        url: String,
        size: String,
        resolution: String,
        name: String,
        thumb: String
    },
    replyCount: Number,
    replies: [{
        postId: Number,
        posterName: String,
        posterCountry: String,
        posterCountryName: String,
        flag: String,
        date: Date,
        dado: String,
        message: String,
        file: {
            url: String,
            size: String,
            resolution: String,
            name: String,
            thumb: String
        },
    }]
});