// const mongoose = require('mongoose');
// const { addCoursesForUsers } = require('../config/populateDB');
const Course = require('../models/Course');
const User = require('../models/User');

//Display the user's schedule in the add course page
exports.addPageCourselist = function(req, res, next) {
  const courseIDs = req.user.courseid;
  Course.find().where('_id').in(courseIDs).exec((err, courses) => {
    res.render('addcourse', {
      user: req.user,
      Courses: courses
    });
  })
};

//Display the user's schedule in the drop course page
exports.dropPageCourselist = function(req, res) {
  const courseID = req.user.courseid;
  Course.find().where('_id').in(courseID).exec((err, courses) => {
    res.render('dropcourse', {
      user: req.user,
      Courses: courses
    });
  })
};

//Search the database for the course and then display the results
exports.searchPageList = function(req, res, next) {
  const courseID = req.body.courseIdForm;
  const courseDept = req.body.deptSelection;
  const courseSemester = req.body.termselection;

  Course.find({ courseNumber: courseID }).and([{ dept: courseDept }, { semester: courseSemester }]).exec((err, courses) => {
    //if no courses were found, only pass the user
    if(courses.length === 0){
      res.render('searchresults', {
        user: req.user
      });
    }
    //if found, pass the user and courses
    else{
      res.render('searchresults', {
        user: req.user,
        Courses: courses
      });
    }
  })
};

exports.saveCourseToUser = async function(req, res){
  const courseID = req.body.courseID;
  const course = await Course.findOne( { courseUniqueID: courseID } );
  let courseFull = course.isCourseFull;
  let courseNumber = course.courseNumber;

  const queryUser = await User.findOne( { email: req.user.email } );
  // let isUserEnrolledInSpecificCourse = (queryUser.courseid.indexOf(course._id) > -1);

  let promise = checkIfEnrolledInSubject(req.user.courseid, courseNumber);

  promise.then(async (isUserEnrolledInSubject) => {
    try{
      if(!courseFull && !isUserEnrolledInSubject){
        const user = await User.findOneAndUpdate( { email: req.user.email },
          { $push:  { courseid: course._id } }
        );

        //if adding the student makes the course reach maxCap then
        //we set the isCourseFull field to true
        if((course.currentCapacity + 1) === course.maxCapacity){
          Course.findOneAndUpdate( { courseUniqueID: courseID },{ 
            $inc: { currentCapacity: 1 },
            $push: { roster: user._id },
            $set: { isCourseFull: true }
          }).exec( function (err){
            if(err)
              console.log(err);
            else
              res.send("success");
            });
          }//end of inner if
          else{
            Course.findOneAndUpdate( { courseUniqueID: courseID },{ 
              $inc: { currentCapacity: 1 },
              $push: { roster: user._id },
            }).exec( function (err){
              if(err)
                console.log(err);
              else
                res.send("success");
            });
          }//end of inner else
      }//end of if block
      else{
        res.send("enrolledAlready");
      }
    }//end of try block
    catch(err){
      console.log(err);
    }
  })//end of promise block
}//end of savecoursetouser

exports.deleteCourseFromUser = async function(req, res){
  const courseID =  req.body.courseID;

  try{
    const course = await Course.findOne( { courseUniqueID: courseID } );
    let courseFull = course.isCourseFull;
    
    const user = await User.findOneAndUpdate( { email: req.user.email },
      { $pull:  { courseid: course._id } }
    );

    //if course was full before user dropped course, then we set isCourseFull to false
    if(courseFull){
      Course.findOneAndUpdate( { courseUniqueID: courseID },{ 
        $inc: { currentCapacity: -1 },
        $pull: { roster: user._id },
        $set: { isCourseFull: false }
        }).exec( function (err){
          if(err)
            console.log(err);
          else
            res.send("success");
        });
      }
      else{
        Course.findOneAndUpdate( { courseUniqueID: courseID },{ 
          $inc: { currentCapacity: -1 },
          $pull: { roster: user._id }
        }).exec( function (err){
          if(err)
            console.log(err);
          else
            res.send("success");
        });
      }
  } //end of try block
  catch(e){
    console.error(e);
    res.status(400).send("Error while saving.")
  }
}//end of deletecoursefromuser

async function checkIfEnrolledInSubject(courseids, courseNum){
  let courses = await Course.find().where('_id').in(courseids);
  let inCourseSubject = false;

  courses.forEach(function (item) {
    if(item.courseNumber === courseNum){
      inCourseSubject = true;
    }
  });

  return inCourseSubject;
}