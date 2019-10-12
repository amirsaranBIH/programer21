const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categoryNumber: {
        type: Number,
        unique: true,
        min: 1,
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    thumbnail: {
        type: String,
        default: 'default_category_thumbnail.jpg',
        get: image => {
            return '/images/' + image;
        },
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],
    usersEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    usersFinished: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
});

var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;