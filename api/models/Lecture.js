const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    index_number: {
        type: Number,
        unique: true,
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    slug: {
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
    html_content_path: {
        type: String,
        trim: true
    },
    skippable: {
        type: Boolean,
        default: false,
        required: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    }
});

mongoose.model('Lecture', LectureSchema);