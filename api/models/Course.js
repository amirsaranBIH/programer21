const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
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
        default: 'assets/images/default_course_image.png',
        required: true
    },
    status: {
        type: String,
        enum: ['public', 'private'],
        default: 'private',
        required: true
    },
    modules: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module',
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
    users: [{
        status: {
            type: String,
            enum: ['enrolled', 'skipped', 'finished'],
            default: 'user',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
});

mongoose.model('Course', CourseSchema);
