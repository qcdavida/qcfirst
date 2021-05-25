const Course = require('../models/Course');
const User = require('../models/User');

exports.listCourses = async function(req, res){
    const courses = await Course.find();
    res.render('admincourses', {
        user: req.user,
        Courses: courses
    });
}

exports.listUsers = async function(req, res){
    const users = await User.find();
    res.render('adminusers', {
        user: req.user,
        Users: users
    });
}

