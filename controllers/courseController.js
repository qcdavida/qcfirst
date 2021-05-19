const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

//Display the user's schedule in the add course page
exports.courselist = function(req, res, next) {
  const courseIDs = req.user.courseid;
  Course.find().where('_id').in(courseIDs).exec((err, courses) => {
    res.render('addcourse', {
      user: req.user,
      Courses: courses
    });
  })
};

//Display the user's schedule in the drop course page
exports.dropCourselist = function(req, res, next) {
  const courseIDs = req.user.courseid;
  Course.find().where('_id').in(courseIDs).exec((err, courses) => {
    res.render('dropcourse', {
      user: req.user,
      Courses: courses
    });
  })
};

//Search the db and display the results
exports.searchlist = function(req, res, next) {
  const courseID = req.body.courseidform;
  const coursedept = req.body.deptSelection;
  const coursesemester = req.body.termselection;

  Course.find({ courseid: courseID }).and([{ dept: coursedept }, { semester: coursesemester }]).exec((err, courses) => {
    res.render('searchresults', {
      user: req.user,
      Courses: courses
    });
  })
};

//this one had ,next in last working code
exports.savecourse = function(req, res, next) {
  const courseID = req.body.courseId;
  const courseSec = req.body.courseSection;

  Course.find({ courseid: courseID }).and([{ courseSection : courseSec }]).exec((err, course) => {
    User.updateOne(
      { _id: req.user.id },
      { $push: { courseid: course[0]._id } },

      function (error, success){
        if (error){
          res.status(500).json(err);
          return;
        }
        else if (!course) {
          res.status(404).json();   
          return;     
        } 
        res.status(200).json(course);
        return;

        //was working with this else and without the above else if
        // else{
        //   console.log("hoping");
        //   res.status(200).json(course);
        //   // res.send("success"); was working with this
        //   // res.render('enrollment', {
        //   //   user: req.user,
        //   // });
        // }
    })

    //same changes above made below:
    Course.updateOne(
      { _id: course[0]._id },
      { $push: { roster : req.user.id} },

      function (error, success){
        if (error){
          res.status(500).json(err);
          return;
        }
        else if (!course) {
          res.status(404).json();  
          return;      
        } 
        res.status(200).json(course);
        return;

        //below code was original:
        // if (error){
        //   console.log(error);
        //   console.log("error here")
        // }
        // else{
        //   console.log("dreaming");
        //   res.send("success");
        // }
    })
  
  
  })

  next();
};

//had ,next in last working code
exports.deletecourse = function(req, res) {
  const courseID = req.body.courseId;
  const courseSec = req.body.courseSection;

  Course.find({ courseid: courseID }).and([{ courseSection : courseSec }]).exec((err, course) => {
    User.updateOne(
      { _id: req.user.id },
      { $pull: { courseid: course[0]._id } },
    
      function (error, success){
        if (error){
          console.log(error);
        }
        else{
          console.log("in here");
          // res.render('enrollment', {
          //   user: req.user,
          // });
        }
      })

    Course.updateOne(
      { _id: course[0]._id },
      { $pull: { roster : req.user.id} },
      
      function (error, success){
        if (error){
          console.log(error);
          console.log("error here")
        }
        else{
          console.log("dreaming");
          res.send("success");
        }
    })
  })
  next();
};





//We are going to need something like this for search results
    // exports.courselist = function(req, res, next) {
    //   Course.find()
    //   .populate('courses')
    //   .exec(function (err, courseList) {
    //       if (err) { return next(err); }
    //       res.render('dropCourse', { 
    //         user: req.user,
    //         title: 'Course List', 
    //         Courses: courseList
    //        });
    //     });
    //   };



    //THIS IS THE WORKING CODE FOR NOW:
    // exports.courselist = function(req, res, next) {
    //   const courseIDs = req.user.courseid;
   
    //   Course.find().where('_id').in(courseIDs).exec((err, courses) => {
    //     console.log(courses);
    //     console.log(courses[1]);
    //     console.log(courses[1].get("coursename"));
    //   })
    //  };