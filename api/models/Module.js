const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
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
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
        required: true
    },
    thumbnail: {
        type: String,
        default: 'default_module_thumbnail.jpg',
        get: image => {
            return '/images/' + image;
        },
        required: true
    },
    status: {
        type: String,
        enum: ['public', 'private'],
        default: 'private',
        required: true
    },
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture',
            required: true
        }
    ],
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
    skippable: {
        type: Boolean,
        default: false,
        required: true
    }
});

mongoose.model('Module', ModuleSchema);
