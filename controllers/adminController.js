// const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');


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

exports.listCoursesDelete = function(req, res) {
  const courseIDs = req.user.courseid;
  Course.find().where('_id').in(courseIDs).exec((err, courses) => {
    res.render('deletecourse', {
      user: req.user,
      Courses: courses
    });
  })
};

exports.displayRoster = async function(req, res){
  const courseID = req.body.courseUniqueID;
  console.log("ccddd: " + courseID);

  const course = await Course.findOne( { courseUniqueID: courseID } );
  console.log(course);
  // if(course)
  //   res.render('profile', {
  //     user: req.user,
  //     Course: course
  //   })
  // else
  //   res.send("error");
}


//add logic to search database before updating
exports.createCourse = async function(req, res){
  const courseNum = req.body.courseNumber;
  const courseSection = req.body.courseSection;
  const courseUniqueID = courseNum + "-" + courseSection;

  const course = await Course.findOne( { courseUniqueID: courseUniqueID } );
  let addedCourse = false;

  if(!course){
    const courseName = req.body.courseName;
    const courseDescription = req.body.courseDescription;
      const courseSemester = req.body.termSelection;
      const courseDept = req.body.courseDept;
      const rosterSize = req.body.courseCapacity;
      const day1 = req.body.firstDay;
      const day2 = req.body.secondDay;
      const courseTime = req.body.timeSelection;

      var newCourse = new Course();
      newCourse.courseNumber = courseNum;
      newCourse.courseSection = courseSection;
      newCourse.courseUniqueID = courseUniqueID;
      newCourse.courseName = courseName;
      newCourse.dept = courseDept;
      newCourse.instructor = req.user.firstname + " " + req.user.lastname;
      newCourse.description = courseDescription;
      newCourse.semester = courseSemester;
      newCourse.currentCapacity = 0;
      newCourse.maxCapacity = rosterSize;
      newCourse.roster = [];
      newCourse.courseStartDate = "09-02-2021";
      newCourse.courseEndDate = "12-02-2021";
      newCourse.enrollmentDeadline = "08-02-2021";
      newCourse.isCourseFull = false;
            
      newCourse.save(function(err) {
        if (err)
          throw err;
        else{
          addedCourse = true;
          console.log(addedCourse);
          console.log(newCourse._id);
        }

        if(addedCourse){
          User.findOneAndUpdate( { email: req.user.email },
            { $push:  { courseid: newCourse._id } },
          ).exec( function (err){
            if(err)
              console.log(err);
            else{
              res.redirect('/instructorhome');
            }
          });
        }
        else{
          console.log("error")
        }
    });
  }//end of outer if statement
  else{
    res.redirect('/createcourse')
  }
} //end of function

exports.deleteCourse = async function(req, res){
  const courseID = req.body.courseUniqueID;

  try{
    Course.remove( { courseUniqueID: courseID } );
  } //end of try block
  catch(e){
    console.log(e)
  }
 }//end of deletecourse function


exports.viewRoster = async function(req, res){

};
