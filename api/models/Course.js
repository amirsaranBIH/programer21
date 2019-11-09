const mongoose = require('mongoose');
const config = require('config');

const CourseSchema = new mongoose.Schema({
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
    thumbnail: {
        type: String,
        default: config.get('UPLOAD_FOLDER') + 'course-images/default_course_thumbnail.jpg',

        required: true
    },
    status: {
        type: String,
        enum: ['public', 'private'],
        default: 'private',
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
    modules: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module',
            required: true
        }
    ],
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
