var mongoose = require('mongoose');
var Course = mongoose.model('Course');
var Module = mongoose.model('Module');
var User = mongoose.model('User');
const config = require('config');
const { compareIds, extractUploadPathFromUrl, nextModuleIndexNumber } = require('../helpers/shared');
const { deleteFile } = require('../helpers/file');

module.exports.createModule = async function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    }

    const nextIndex = await nextModuleIndexNumber();

    const newModule = new Module({
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        difficulty: req.body.difficulty,
        status: req.body.status,
        skippable: req.body.skippable,
        creator: req.payload._id,
        index_number: nextIndex,
        course: req.params.course_id
    });
    if (req.file) {
        newModule.image = config.get('HOST') + req.file.destination + '/' + req.file.filename;
    }

    newModule.save((err, createdModule) => {
        if (err) throw err;
        Course.findByIdAndUpdate(req.params.course_id, { "$push": { "modules": createdModule._id } }, (err) => (err) ? console.error(err) : '');

        res.json({
            status: true
        });
    });
};

module.exports.editModule = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    }

    Module.findById(req.params.module_id, (err, _module) => {
        if (err) throw err;
    
        if (req.file) {
          req.body.image = config.get('HOST') + req.file.destination + '/' + req.file.filename;
          deleteFile(extractUploadPathFromUrl(_module.image));
        }
        
        _module.update(req.body, (err) => {
          if (err) throw err;
        });
        
        res.json({ status: true });
      });
};

module.exports.getAllModules = function (req, res) {
    Module.find({}, (err, modules) => {
        if (err) throw err;

        res.json(modules);
    });
};

module.exports.getModuleById = function (req, res) {
    Module.findById(req.params.module_id, (err, _module) => {
        if (err) throw err;

        res.json(_module);
    });
};

module.exports.deleteModule = function (req, res) {
    Module.findOneAndDelete(req.params.module_id, err => {
      if (err) {
        console.error(err);
      }
  
      res.json({ status: true });
    });
};

module.exports.skipModule = function (req, res) {
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
        const skippedModuleId = course.course.modules[course.currentModuleIndex]._id;

        course.course.modules[course.currentModuleIndex].lectures.forEach(lecture => {
            if (
                course.lecturesFinished.some(finishedLectureId => compareIds(finishedLectureId, lecture._id)) ||
                course.lecturesSkipped.some(skippedLectureId => compareIds(skippedLectureId, lecture._id))
            ) {
                // if lecture is already skipped or finished 
                console.log(lecture._id);
                return;
            }
            console.log('=======================');
            user.coursesEnrolledIn[req.params.course_index].lecturesSkipped.push(lecture._id);
        });

        user.coursesEnrolledIn[req.params.course_index].currentModuleIndex = req.params.module_next_index;
        user.coursesEnrolledIn[req.params.course_index].currentLectureIndex = 0;
        user.coursesEnrolledIn[req.params.course_index].modulesSkipped.push(skippedModuleId);

        user.save(err => {
            if (err) throw err;
            res.json({ status: true });
        });
    });
};

module.exports.finishModule = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    }

    User.findById(req.payload._id).populate({
        path: 'coursesEnrolledIn.course',
        populate: {
            path: 'modules'
        }
    }).exec((err, user) => {
        if (err) throw err;

        const course = user.coursesEnrolledIn[req.params.course_index];
        const finishedModuleId = course.course.modules[course.currentModuleIndex]._id;

        user.coursesEnrolledIn[req.params.course_index].currentModuleIndex = req.params.module_next_index;
        user.coursesEnrolledIn[req.params.course_index].currentLectureIndex = 0;
        user.coursesEnrolledIn[req.params.course_index].modulesFinished.push(finishedModuleId);

        user.save(err => {
            if (err) throw err;
            res.json({ status: true });
        });
    });
};
