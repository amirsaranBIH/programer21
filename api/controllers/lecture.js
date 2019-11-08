var mongoose = require('mongoose');
var Module = mongoose.model('Module');
var Lecture = mongoose.model('Lecture');

module.exports.createLecture = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    } else {
        let newLecture = new Lecture({
            title: req.body.title,
            description: req.body.description,
            difficulty: req.body.difficulty,
            status: req.body.status,
            body: req.body.body,
            skippable: req.body.skippable,
            creator: req.payload._id,
            
        });

        if (req.body.thumbnail.trim()) {
            newLecture.thumbnail = req.body.thumbnail;
        }
    
        newLecture.save((err, createdLecture) => {
            if (err) {
                console.error(err);
            }

            Module.findByIdAndUpdate(req.params.module_id, 
                { "$push": { "lectures": createdLecture._id } }, (err) => (err) ? console.error(err): '');

            res.json({
                status: true,
                createdLectureId: createdLecture._id
            });
        });
        
      }
};

module.exports.editLecture = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    } else {
        Lecture.findByIdAndUpdate(req.params.lecture_id, req.body, (err) => {
            if (err) {
                console.error(err)
            }

            res.json({
                status: true
            });
        });   
    }
};

module.exports.getAllLectures = function(req, res) {
    Lecture.find({}, (err, lectures) => {
        if (err) {
            console.error(err);
        }

        res.json(lectures);
    });
};

module.exports.getLectureById = function(req, res) {
    Lecture.findById(req.params.lecture_id, (err, lecture) => {
        if (err) {
            console.error(err);
        }

        res.json(lecture);
    });
};
