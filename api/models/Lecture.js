const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    lectureNumber: {
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
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
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
    body: {
        type: String,
        trim: true,
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
});

var Lecture = mongoose.model('Lecture', LectureSchema);

module.exports = Lecture;