var mongoose = require('mongoose');
var Course = mongoose.model('Course');
var Module = mongoose.model('Module');

module.exports.createModule = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
          message : 'UnauthorizedError: private course',
          status: false
        });
    } else {
        const newModule = new Module({
            title: req.body.title,
            description: req.body.description,
            creator: req.payload._id
        });
    
        newModule.save((err, createdModule) => {
            if (err) {
                console.error(err);
            }
            Course.findByIdAndUpdate(req.params.course_id, { "$push": { "modules": createdModule._id } }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );

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
