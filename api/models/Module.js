const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    moduleNumber: {
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
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
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
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
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
    estimatedTimeToFinish: {
        type: String,
        get: time => {
            const hrs = Math.floor(time / 3600);
            const mins = Math.floor((time % 3600) / 60);
            const secs = Math.floor(time % 60);

            let ret = '';

            if (hrs > 0) ret += `${hrs}:${mins < 10 ? '0' : ''}`;

            ret += `${mins}:${secs < 10 ? '0' : ''}`;
            ret += secs;
            return ret;
        },
        required: true
    },
    skippable: {
        type: Boolean,
        default: false,
        required: true
    },
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    }]
});

var Module = mongoose.model('Module', ModuleSchema);

module.exports = Module;