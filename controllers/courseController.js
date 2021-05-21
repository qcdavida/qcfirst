const mongoose = require('mongoose');
const { addCoursesForUsers } = require('../config/populateDB');
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
exports.dropPageCourselist = function(req, res, next) {
  const courseIDs = req.user.courseid;
  Course.find().where('_id').in(courseIDs).exec((err, courses) => {
    res.render('dropcourse', {
      user: req.user,
      Courses: courses
    });
  })
};

//Search the db and display the results
exports.searchPageList = function(req, res, next) {
  const courseID = req.body.courseIdForm;
  const courseDept = req.body.deptSelection;
  const courseSemester = req.body.termselection;

  Course.find({ courseNumber: courseID }).and([{ dept: courseDept }, { semester: courseSemester }]).exec((err, courses) => {
    res.render('searchresults', {
      user: req.user,
      Courses: courses
    });
  })
};


exports.saveCourseToUser = async function(req, res){
  const courseID = req.body.courseNumber;

  try{
    const course = await Course.findOne( { courseNumber: courseID } );
    const queryUser = await User.findOneAndUpdate( { email: req.user.email } );
    let courseFull = course.isCourseFull;
    let isUserAlreadyEnrolled = (queryUser.courseid.indexOf(course._id) > -1);
    
    if(!course){
      res.json( { success: false, message: "Course doesn't exist."});
      return;
    }
    else{
      //check to make sure the class is open and that the student isn't already enrolled in the class
      if(!courseFull && !(isUserAlreadyEnrolled)){
        const user = await User.findOneAndUpdate( { email: req.user.email },
          { $push:  { courseid: course._id } }
        );

        //if adding the student makes the course reach maxCap then
        //we set the isCourseFull field to true
        if((course.currentCapacity + 1) === course.maxCapacity){
          Course.findOneAndUpdate( { courseNumber: courseID },{ 
            $inc: { currentCapacity: 1 },
            $push: { roster: user._id },
            $set: { isCourseFull: true }
            }).exec( function (err){
              if(err)
                console.log(err);
            });
        }
        //otherwise we do this
        else{
          Course.findOneAndUpdate( { courseNumber: courseID },{ 
            $inc: { currentCapacity: 1 },
            $push: { roster: user._id },
            }).exec( function (err){
              if(err)
                console.log(err);
            });
        }
      }
    } //end of else statement
  } //end of try block
  catch(e){
    console.error(e);
    res.status(400).send("Error while saving.")
  }



}//end of savecoursetouser


//this is the newer version that work-ish
// exports.saveCourseToUser = async function(req, res){
//   const courseID = req.body.courseNumber;
//   let addedCourse = false;
//   let userID = "";

//   console.log("up here: " + addedCourse);
//   Course.findOne({ courseNumber: courseID }, function(err, course){
//     if(err)
//       console.log(err);

//     if(course){
//       console.log("course info:");
//       console.log(course);

//       User.findOne( { email: req.user.email }, function(err, user){
//         if(err)
//           console.log(err);
        
//         if(user){
//           console.log("User info:")
//           console.log(user);
//           userID = user._id;
//           console.log("userID: " + userID);
//           user.updateOne(
//             { $push:  { courseid: course._id } },
//             function (err) {
//               if (err) 
//                 console.log("error up");
//               else{
//                 addedCourse = true;
//                 console.log("in here: " + addedCourse);
//               }
//         });
//         }
//       })

//       console.log("down here: " + addedCourse);
//       if(addedCourse){
//         console.log("We made it");
//         console.log(course);
//         course.updateOne(
//           { $inc: { currentCapacity: 1 } },
//           { $push:  { roster: req.user.id } }
//           , function(error){
//             if(error)
//               console.log(error);
//         });
  
//         console.log(course.currentCapacity);
//         console.log("^^");
  
//         if(course.currentCapacity === course.maxCapacity){
//           course.UpdateOne(
//             { $set: { isCourseFull: true} },
//             function(error){
//               console.log(error);
//           })
//         }
//       }
//     }
//   });

// }

//this was the original version:
// exports.saveCourseToUser = async function(req, res){
//   // const courseID = req.body.courseId;
//   // const courseSec = req.body.courseSection;
//   //Above code was last working.  Find out where req.body.courseId is coming from

//   const courseID = req.body.courseNumber;

//   //const course = await Course.findOne({ courseid: courseID }).and([{ courseSection : courseSec }]);
//   const course = await Course.findOne({ courseNumber: courseID });
//   const student = await User.findOne( { email: req.user.email } );

//   console.log("course info:");
//   console.log(course);
//   console.log("");
//   console.log("student info:");
//   console.log(student);
//   //if course is full, user can't add the course
//   console.log("second info: " + course.isCourseFull)
//   if(course.isCourseFull === true){
//     res.send("Sorry, course is full");
//   }
//   else{
//     console.log("in else, c id: " + course._id );
//     // Next two lines are working:
//     student.courseid.push( { _id: course._id } );
//     course.roster.push( {_id: student.id } );
//     course.currentCapacity.inc();
//     course.currentCapacity.update({ $inc: { currentCapacity: 1 } });

//     // student.updateOne(
//     //   { $push:  { courseid: course._id } },
//     //   function (err) {
//     //       if (err) 
//     //         console.log("error up");
//     //   });

//     // course.updateOne(
//     //   { $inc: { currentCapacity: 1 } },
//     //   { $push:  { roster: student._id } }
//     //   , function(error){
//     //     console.log(error);
//     //   });

//     // console.log("roster count: " + course.currentCapacity);
//     // if(course.currentCapacity === course.maxCapacity){
//     //   course.updateOne( { isCourseFull: true });
//     //   console.log("Upcount++");
//     // }
//     // else{
//     //   console.log("not equal");
//     // }

//     const doc = await student.save();
//     const doc2 = await course.save();
//     console.log(doc);
//     console.log(doc2);
//   }
// }

exports.deleteCourseFromUser= async function(req, res){
  // const courseID = req.body.courseId;
  // const courseSec = req.body.courseSection;

  const courseID = req.body.courseNumber;

  // const course = await Course.findOne({ courseid: courseID }).and([{ courseSection : courseSec }]);
  const course = await Course.findOne({ courseid: courseID });
  if(course){
    console.log("Found!")
    console.log(course._id);
  }
  else{
    console.log("Not found");
  }

  User.findOne({email: "120@gmail.com"}, function(err, result){
    if(err) {
      console.log(err);
    }
    else{
      result.courseid.pull(course._id);
      result.save();
      console.log("HOLY FUCK!!!")
      res.render('enrollment', {
        user: req.user,
        });
    }
  })
}

//this one had ,next in last working code
// exports.savecourse = function(req, res, next) {
//   const courseID = req.body.courseId;
//   const courseSec = req.body.courseSection;

//   Course.find({ courseid: courseID }).and([{ courseSection : courseSec }]).exec((err, course) => {
//     User.updateOne(
//       { _id: req.user.id },
//       { $push: { courseid: course[0]._id } },

//       function (error, success){
//         if (error){
//           res.status(500).json(err);
//           return;
//         }
//         else if (!course) {
//           res.status(404).json();   
//           return;     
//         } 
//         res.status(200).json(course);
//         return;

//         //was working with this else and without the above else if
//         // else{
//         //   console.log("hoping");
//         //   res.status(200).json(course);
//         //   // res.send("success"); was working with this
//         //   // res.render('enrollment', {
//         //   //   user: req.user,
//         //   // });
//         // }
//     })

//     //same changes above made below:
//     Course.updateOne(
//       { _id: course[0]._id },
//       { $push: { roster : req.user.id} },

//       function (error, success){
//         if (error){
//           res.status(500).json(err);
//           return;
//         }
//         else if (!course) {
//           res.status(404).json();  
//           return;      
//         } 
//         res.status(200).json(course);
//         return;

//         //below code was original:
//         // if (error){
//         //   console.log(error);
//         //   console.log("error here")
//         // }
//         // else{
//         //   console.log("dreaming");
//         //   res.send("success");
//         // }
//     })
  
  
//   })

//   next();
// };

//had ,next in last working code
// exports.deletecourse = function(req, res) {
//   const courseID = req.body.courseId;
//   const courseSec = req.body.courseSection;

//   Course.find({ courseid: courseID }).and([{ courseSection : courseSec }]).exec((err, course) => {
//     User.updateOne(
//       { _id: req.user.id },
//       { $pull: { courseid: course[0]._id } },
    
//       function (error, success){
//         if (error){
//           console.log(error);
//         }
//         else{
//           console.log("in here");
//           // res.render('enrollment', {
//           //   user: req.user,
//           // });
//         }
//       })

//     Course.updateOne(
//       { _id: course[0]._id },
//       { $pull: { roster : req.user.id} },
      
//       function (error, success){
//         if (error){
//           console.log(error);
//           console.log("error here")
//         }
//         else{
//           console.log("dreaming");
//           res.send("success");
//         }
//     })
//   })
//   next();
// };





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