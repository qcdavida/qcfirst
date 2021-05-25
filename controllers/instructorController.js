const Course = require('../models/Course');
const User = require('../models/User');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

//Display the instructor's schedule in the manage course page
exports.listCourses = function(req, res) {
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

exports.searchCourses = function(req, res){
  const courseID = req.body.courseIdForm;
  const courseDept = req.body.deptSelection;
  const courseSemester = req.body.termselection;

  Course.find({ courseNumber: courseID }).and([{ dept: courseDept }, { semester: courseSemester }]).exec((err, courses) => {
    //if no courses were found, only pass the user
    if(courses.length === 0){
      res.render('instructorSearchResults', {
        user: req.user,
        moment: moment 
      });
    }
    //if found, pass the user and courses
    else{
      res.render('instructorSearchResults', {
        user: req.user,
        Courses: courses,
        moment: moment 
      });
    }
    if(err){
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }
  })
};

exports.displayRoster = async function(req, res){
  const courseID = req.body.courseUniqueID;
  const course = await Course.findOne( { courseUniqueID: courseID } );

  User.find().where('_id').in(course.roster).exec((err, students) => {
    if(err)
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    if(students){
      res.send(students);
    }
  })
}

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
    const timeSelection = req.body.timeSelection;
    let formatTimeSelection = timeSelection.split('-');

    let courses = await Course.find().where('_id').in(req.user.courseid);
    let timeConflict = checkForTimeConflicts(courses, courseSemester, day1, day2, formatTimeSelection);

    if(timeConflict){
      res.send(409);
      res.redirect('/instructorhome');
    }
    else{
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
      newCourse.classDays.dayOne = day1;
      newCourse.classDays.dayTwo = day2;
      newCourse.startTime = formatTimeSelection[0];
      newCourse.endTime = formatTimeSelection[1];
      newCourse.courseStartDate = "09-02-2021";
      newCourse.courseEndDate = "12-02-2021";
      newCourse.enrollmentDeadline = "08-02-2021";
      newCourse.isCourseFull = false;
              
      newCourse.save(function(err) {
        if (err)
          throw err;
        else{
          addedCourse = true;
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
      });//end of save() 
    }
  }//end of outer if statement
  else{
    res.redirect('/createcourse')
  }
} //end of create course function

exports.deleteCourse = async function(req, res){
  const courseID = req.body.courseUniqueID;

  try{
    console.log(courseID);
    const course = await Course.findOne( { courseUniqueID: courseID } );
    console.log(course);
    course.remove();
  }
  catch(e){
    console.log(e)
  }
 }//end of deletecourse function


function checkForTimeConflicts(userCourses, newClassSemester, newClassDay1, newClassDay2, newClassTime){
  let scheduleConflict = false;

  for(let i = 0; i < userCourses.length; i++){
    if(userCourses[i].semester != newClassSemester){
      console.log("");
    }
    else{
      //check if user course day one is equal to course to be added day one
      //if it does then check if time conflicts
      if(userCourses[i].classDays.dayOne == newClassDay1){

        let c1StartTime = "2021-5-24 " + userCourses[i].startTime.split(" ")[0];
        let c1EndTime = "2021-5-24 " + userCourses[i].endTime.split(" ")[0];
        let c2StartTime = "2021-5-24 " + newClassTime[0].split(" ")[0];
        let c2EndTime = "2021-5-24 " + newClassTime[1].split(" ")[0];

        scheduleConflict = helperTimeFunction(c1StartTime, c1EndTime, c2StartTime, c2EndTime);

        if(scheduleConflict)
          return scheduleConflict;
      }
      
      //check if user course day one is equal to course to be added day two
      if(userCourses[i].classDays.dayOne == newClassDay2){

        let c1StartTime = "2021-5-24 " + userCourses[i].startTime.split(" ")[0];
        let c1EndTime = "2021-5-24 " + userCourses[i].endTime.split(" ")[0];
        let c2StartTime = "2021-5-24 " + newClassTime[0].split(" ")[0];
        let c2EndTime = "2021-5-24 " + newClassTime[1].split(" ")[0];

        scheduleConflict = helperTimeFunction(c1StartTime, c1EndTime, c2StartTime, c2EndTime);

        if(scheduleConflict)
          return scheduleConflict;
      }
      
      //check if user course day two is equal to course to be added day one
      if(userCourses[i].classDays.dayTwo == newClassDay1){
        
        let c1StartTime = "2021-5-24 " + userCourses[i].startTime.split(" ")[0];
        let c1EndTime = "2021-5-24 " + userCourses[i].endTime.split(" ")[0];
        let c2StartTime = "2021-5-24 " + newClassTime[0].startTime.split(" ")[0];
        let c2EndTime = "2021-5-24 " + newClassTime[1].split(" ")[0];

        scheduleConflict = helperTimeFunction(c1StartTime, c1EndTime, c2StartTime, c2EndTime);

        if(scheduleConflict)
          return scheduleConflict;
      }
      
      //check if user course day two is equal to course to be added day two
      if(userCourses[i].classDays.dayTwo == newClassDay2){

        let c1StartTime = "2021-5-24 " + userCourses[i].startTime.split(" ")[0];
        let c1EndTime = "2021-5-24 " + userCourses[i].endTime.split(" ")[0];
        let c2StartTime = "2021-5-24 " + newClassTime[0].split(" ")[0];
        let c2EndTime = "2021-5-24 " + newClassTime[1].split(" ")[0];

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