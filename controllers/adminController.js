const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

exports.index = function(req, res, next) {
    res.render('instructorhomepage', {
        user : req.user
    })
};

//Display the instructor's schedule in the manage course page
exports.listCourses = function(req, res, next) {
  const courseIDs = req.user.courseid;
  Course.find().where('_id').in(courseIDs).exec((err, courses) => {
    res.render('managecourse', {
      user: req.user,
      Courses: courses
    });
  })
};

exports.listCoursesDelete = function(req, res, next) {
    const courseIDs = req.user.courseid;
    Course.find().where('_id').in(courseIDs).exec((err, courses) => {
      res.render('deletecourse', {
        user: req.user,
        Courses: courses
      });
    })
  };

  //add logic to search database before updating
exports.createCourse = function(req, res, next) {
    const courseID = req.body.courseidform;
    const courseSection = req.body.courseSection;
    const courseSemester = req.body.termSelection;
    const courseDept = req.body.courseDept;
    const rosterSize = req.body.courseCapacity;
    const days = req.body.daySelection;
    const courseTime = req.body.timeSelection;

    var newCourse = new Course();
    newCourse.courseid = courseID;
    newCourse.courseSection = courseSection;
    newCourse.semester = courseSemester;
    newCourse.dept = courseDept;
    newCourse.classcapacity = rosterSize;
    newCourse.instructor = req.user.firstname + " " + req.user.lastname;
    newCourse.credits = 3;
    newCourse.decription = "Web tech";
    newCourse.roster = [];
            
    newCourse.save(function(err) {
        if (err)
            throw err;
        res.send("goat");
    });




    
    //   Course.findOne({ courseid: courseID }).and([{ courseSection: courseSection }]), function(err, course) {
    //     console.log(course);
    //     console.log("almost done");
    //     if (err){
    //         res.send('error')
    //         next();
    //     }
    //     if (course){
    //         res.send('Already a course with that course id and section number.')
    //         next();
    //     }
    //     else {
    //         console.log("in here");
    //         res.send("happy");
    //         var newCourse = new Course();
    //         newCourse.courseid = courseID;
    //         newCourse.courseSection = courseSection;
    //         newCourse.semester = courseSemester;
    //         newCourse.dept = courseDept;
    //         newCourse.classcapacity = rosterSize;
    //         newCourse.instructor = req.user.firstname + " " + req.user.lastname;
    //         newCourse.credits = 3;
    //         newCourse.decription = "Web tech";
    //         newCourse.roster = [];
            
    //         newCourse.save(function(err) {
    //             if (err)
    //                 throw err;
    //             return done(null, newUser);
    //         });
    //     }
    // };   
}

exports.deleteCourse = function(req, res, next) {
  const courseID = req.body.courseId;
  const courseSec = req.body.courseSection;

  console.log("progress");
  console.log(courseID);
  console.log(courseSec);

  Course.find({ courseid: courseID }).and([{ courseSection : courseSec }]).exec((err, course) => {

    console.log(course[0]);
    console.log("c id: " + course[0]._id );
    console.log("u id: " + req.user.id);
    User.updateOne(
      { _id: req.user.id },
      { $pull: { 'courseid': { "_id": course[0]._id } } },
      // { new: true },
      function(err, docs) {
          if (err) { 
            console.log(err);
            res.redirect("/");
          }
          else{
            console.log("Updated user: ", docs);
            // res.redirect("/deletecourse");
          }
      }
    )
    
  })
 };


exports.viewroster = function(req, res, next) {
    console.log("ID");
    console.log(req.body.courseid);
    var courseID = req.body.courseid;
    var courseSec = req.body.courseSection;
    console.log("Sec")
    console.log(req.body.courseSection);
    Course.find({ courseid: courseID }).and([{ courseSection: courseSec }]).select('roster').exec((err, roster) => {
        res.render('roster', {
            user: req.user,
            Roster: roster
        });
    })
};
