const Course = require('../models/Course');
const User = require('../models/User');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

//Display the user's schedule in the add course page
exports.addPageCourselist = function(req, res) {
  const courseIDs = req.user.courseid;
  Course.find().where('_id').in(courseIDs).exec((err, courses) => {
    if(err)
      return res.status(404).json({message: 'Something went wrong, please try again.'});
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
    if(err){
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }
    res.render('dropcourse', {
      user: req.user,
      Courses: courses
    });
  })
};

//Search the database for the course and then display the results
exports.searchPageList = function(req, res) {
  const courseID = req.body.courseIdForm;
  const courseDept = req.body.deptSelection;
  const courseSemester = req.body.termselection;

  Course.find({ courseNumber: courseID }).and([{ dept: courseDept }, { semester: courseSemester }]).exec((err, courses) => {
    //if no courses were found, only pass the user
    if(err) 
      return res.status(404).json({message: 'Something went wrong, please try again.'});
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

  let courses = await Course.find().where('_id').in(req.user.courseid);
  let timeConflict = checkForTimeConflicts(courses, course);

  if(timeConflict){
    res.send("timeConflict")
  }
  else{
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
  }//end of else
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

//this function checks for any time conflicts between the courses the user
//is already enrolled in and the course they are trying to add
function checkForTimeConflicts(userCourses, courseToAdd){
  let scheduleConflict = false;

  for(let i = 0; i < userCourses.length; i++){
    if(userCourses[i].semester != courseToAdd.semester){
      console.log("Not equal");
    }
    else{
      //check if user course day one is equal to course to be added day one
      //if it does then check if time conflicts
      if(userCourses[i].classDays.dayOne == courseToAdd.classDays.dayOne){

        let c1StartTime = "2021-5-24 " + userCourses[i].startTime.split(" ")[0];
        let c1EndTime = "2021-5-24 " + userCourses[i].endTime.split(" ")[0];
        let c2StartTime = "2021-5-24 " + courseToAdd.startTime.split(" ")[0];
        let c2EndTime = "2021-5-24 " + courseToAdd.endTime.split(" ")[0];

        scheduleConflict = helperTimeFunction(c1StartTime, c1EndTime, c2StartTime, c2EndTime);

        if(scheduleConflict)
          return scheduleConflict;
      }
      
      //check if user course day one is equal to course to be added day two
      if(userCourses[i].classDays.dayOne == courseToAdd.classDays.dayTwo){

        let c1StartTime = "2021-5-24 " + userCourses[i].startTime.split(" ")[0];
        let c1EndTime = "2021-5-24 " + userCourses[i].endTime.split(" ")[0];
        let c2StartTime = "2021-5-24 " + courseToAdd.startTime.split(" ")[0];
        let c2EndTime = "2021-5-24 " + courseToAdd.endTime.split(" ")[0];

        scheduleConflict = helperTimeFunction(c1StartTime, c1EndTime, c2StartTime, c2EndTime);

        if(scheduleConflict)
          return scheduleConflict;
      }
      
      //check if user course day two is equal to course to be added day one
      if(userCourses[i].classDays.dayTwo == courseToAdd.classDays.dayOne){
        
        let c1StartTime = "2021-5-24 " + userCourses[i].startTime.split(" ")[0];
        let c1EndTime = "2021-5-24 " + userCourses[i].endTime.split(" ")[0];
        let c2StartTime = "2021-5-24 " + courseToAdd.startTime.split(" ")[0];
        let c2EndTime = "2021-5-24 " + courseToAdd.endTime.split(" ")[0];

        scheduleConflict = helperTimeFunction(c1StartTime, c1EndTime, c2StartTime, c2EndTime);

        if(scheduleConflict)
          return scheduleConflict;
      }
      
      //check if user course day two is equal to course to be added day two
      if(userCourses[i].classDays.dayTwo == courseToAdd.classDays.dayTwo){

        let c1StartTime = "2021-5-24 " + userCourses[i].startTime.split(" ")[0];
        let c1EndTime = "2021-5-24 " + userCourses[i].endTime.split(" ")[0];
        let c2StartTime = "2021-5-24 " + courseToAdd.startTime.split(" ")[0];
        let c2EndTime = "2021-5-24 " + courseToAdd.endTime.split(" ")[0];

        scheduleConflict = helperTimeFunction(c1StartTime, c1EndTime, c2StartTime, c2EndTime);

        if(scheduleConflict)
          return scheduleConflict;
      }
    }//end of for loop
  }
}//end of function

//this is to help the above function to make the code look cleaner 
//this function checks if class times overlap.
function helperTimeFunction(c1StartTime, c1EndTime, c2StartTime, c2EndTime){
  let timeConflict = false;

  var time1 = [moment(c1StartTime), moment(c1EndTime)];
  var time2 = [moment(c2StartTime), moment(c2EndTime)];

  var range = moment.range(time1);
  var range2 = moment.range(time2);

  if(range.overlaps(range2)) {
    if((range2.contains(range, true) || range.contains(range2, true)) && !time1[0].isSame(time2[0])){
      timeConflict = true;
      return timeConflict;
    }
    else{
      timeConflict = true;
      return timeConflict = true;
    }
  }
  return timeConflict;
}