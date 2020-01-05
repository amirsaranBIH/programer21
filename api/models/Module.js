const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
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
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
        required: true
    },
    image: {
        type: String,
        default: 'assets/images/default_module_image.png',
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
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
});

mongoose.model('Module', ModuleSchema);
