const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Module = mongoose.model('Module');
const Lecture = mongoose.model('Lecture');

function extractUploadPathFromUrl(url) {
    return ['uploads', url.split('uploads/')[1]].join('/'); 
}

function compareIds(id1, id2) {
    return JSON.stringify(id1) === JSON.stringify(id2);
}

async function nextCourseIndexNumber() {
    const courses = await Course
    .find({}, 'index_number')
    .sort({index_number : -1})
    .limit(1)
    .exec();
  
    if (courses.length < 1) {
      return 0;
    }
  
    const course = courses[0];
  
    return course.index_number + 1;
  }

async function nextModuleIndexNumber() {
    const modules = await Module
    .find({}, 'index_number')
    .sort({index_number : -1})
    .limit(1)
    .exec();

    if (modules.length < 1) {
        return 0;
    }

    const _module = modules[0];
  
    return _module.index_number + 1;
}

async function nextLectureIndexNumber() {
    const lectures = await Lecture
    .find({}, 'index_number')
    .sort({index_number : -1})
    .limit(1)
    .exec();

    if (lectures.length < 1) {
        return 0;
    }

    const lecture = lectures[0];
  
    return lecture.index_number + 1;
}

module.exports = { compareIds, extractUploadPathFromUrl, nextCourseIndexNumber, nextModuleIndexNumber, nextLectureIndexNumber };