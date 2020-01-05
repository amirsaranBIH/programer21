const mongoose = require('mongoose');
const Module = mongoose.model('Module');
const Lecture = mongoose.model('Lecture');
const User = mongoose.model('User');
const { nextLectureIndexNumber } = require('../helpers/shared');
const { createDirectory, readFile, createFile } = require('../helpers/file');

module.exports.createLecture = async function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    }

    const nextIndex = await nextLectureIndexNumber();

    const newLecture = new Lecture({
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        difficulty: req.body.difficulty,
        status: req.body.status,
        skippable: req.body.skippable,
        creator: req.payload._id,
        index_number: nextIndex,
        module: req.params.module_id
    });

    if (req.body.image.trim()) {
        newLecture.image = req.body.image;
    }

    newLecture.save((err, createdLecture) => {
        if (err) throw err;

        Module.findByIdAndUpdate(req.params.module_id,
            { "$push": { "lectures": createdLecture._id } }, (err) => (err) ? console.error(err) : '');

        const newDirectoryPath = createDirectory('lectures/' + createdLecture.slug);
        const newFilePath = newDirectoryPath + '/' + createdLecture.slug + '.html';
        createFile(newFilePath);

        Lecture.findByIdAndUpdate(createdLecture._id, { html_content_path: newFilePath }, (err) => (err) ? console.error(err) : '')

        res.json({
            status: true,
            createdLectureId: createdLecture._id
        });
    });
};

module.exports.editLecture = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    }

    Lecture.findByIdAndUpdate(req.params.lecture_id, req.body, (err) => {
        if (err) {
            console.error(err)
        }

        res.json({
            status: true
        });
    });
};

module.exports.getAllLectures = function (req, res) {
    Lecture.find({}, (err, lectures) => {
        if (err) throw err;

        res.json(lectures);
    });
};

module.exports.getLectureById = function (req, res) {
    Lecture.findById(req.params.lecture_id, (err, lecture) => {
        if (err) throw err;

        res.json(lecture);
    });
};

module.exports.getLectureBySlug = function (req, res) {
    Lecture.findOne({ slug: req.params.slug }, (err, lecture) => {
        if (err) throw err;

        res.json(lecture);
    });
};

module.exports.getLectureHTMLContentBySlug = function (req, res) {
    Lecture
        .findOne({ slug: req.params.slug })
        .select('html_content_path')
        .exec((err, lecture) => {
            if (err) throw err;

            if (lecture === null) {
                return res.status(404).json({ status: false });
            }

            const htmlContent = readFile(lecture.html_content_path);

            res.json({ status: true, data: htmlContent });
        });
};

module.exports.deleteLecture = function (req, res) {
    Lecture.findOneAndDelete(req.params.lecture_id, err => {
        if (err) throw err;

        res.json({ status: true });
    });
};

module.exports.skipLecture = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    }

    User.findById(req.payload._id).populate({
        path: 'coursesEnrolledIn.course',
        populate: {
            path: 'modules',
            populate: {
                path: 'lectures',
                model: 'Lecture'
            }
        }
    }).exec((err, user) => {
        if (err) throw err;

        const course = user.coursesEnrolledIn[req.params.course_index];
        const skippedLectureId = course.course.modules[course.currentModuleIndex].lectures[course.currentLectureIndex]._id;

        user.coursesEnrolledIn[req.params.course_index].currentModuleIndex = req.params.module_next_index;
        user.coursesEnrolledIn[req.params.course_index].currentLectureIndex = req.params.lecture_next_index;
        user.coursesEnrolledIn[req.params.course_index].lecturesSkipped.push(skippedLectureId);

        user.save(err => {
            if (err) throw err;

            res.json({ status: true });
        });
    });
};

module.exports.finishLecture = function (req, res) {
    console.log('works')
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    }

    User.findById(req.payload._id).populate({
        path: 'coursesEnrolledIn.course',
        populate: {
            path: 'modules',
            populate: {
                path: 'lectures',
                model: 'Lecture'
            }
        }
    }).exec((err, user) => {
        if (err) throw err;

        const course = user.coursesEnrolledIn[req.params.course_index];
        const finishedLectureId = course.course.modules[course.currentModuleIndex].lectures[course.currentLectureIndex]._id;

        user.coursesEnrolledIn[req.params.course_index].currentModuleIndex = req.params.module_next_index;
        user.coursesEnrolledIn[req.params.course_index].currentLectureIndex = req.params.lecture_next_index;
        user.coursesEnrolledIn[req.params.course_index].lecturesFinished.push(finishedLectureId);

        user.save(err => {
            if (err) throw err;

            res.json({ status: true });
        });
    });
};
