var mongoose = require('mongoose');
var Course = mongoose.model('Course');
var Module = mongoose.model('Module');
const config = require('config');

module.exports.createModule = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    } else {
        let newModule = new Module({
            title: req.body.title,
            description: req.body.description,
            difficulty: req.body.difficulty,
            status: req.body.status,
            skippable: req.body.skippable,
            creator: req.payload._id
        });
        if (req.file) {
            newModule.thumbnail = config.get('HOST') + req.file.destination + '/' + req.file.filename;
        }
    
        newModule.save((err, createdModule) => {
            if (err) {
                console.error(err);
            }
            Course.findByIdAndUpdate(req.params.course_id, { "$push": { "modules": createdModule._id } }, (err) => (err) ? console.error(err): '');

            res.json({
                status: true
            });
        });
        
      }
};

module.exports.editModule = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({ status: false });
    } else {
        Module.findByIdAndUpdate(req.params.module_id, req.body, (err) => {
            if (err) {
                console.error(err)
            }

            res.json({
                status: true
            });
        });   
    }
};

module.exports.getAllModules = function(req, res) {
    Module.find({}, (err, modules) => {
            if (err) {
                console.error(err);
            }

        res.json(modules);
    });
};

module.exports.getModuleById = function(req, res) {
    Module.findById(req.params.module_id, (err, _module) => {
        if (err) {
            console.error(err);
        }

        res.json(_module);
    });
};
