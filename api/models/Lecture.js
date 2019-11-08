const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
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
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
        required: true
    },
    status: {
        type: String,
        enum: ['public', 'private'],
        default: 'private',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    skippable: {
        type: Boolean,
        default: false,
        required: true
    },
});

mongoose.model('Lecture', LectureSchema);