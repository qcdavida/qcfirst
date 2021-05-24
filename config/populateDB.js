const Course = require('../models/Course');
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const coursesArray = [
    {
        courseNumber: "355",
        courseSection: "05",
        courseUniqueID: "355-05",
        courseName: "Web Tech",
        dept: "Computer Science",
        instructor: "Jake deGoat",
        description: "Learn to develop web apps",
        semester: "Fall 2021",
        currentCapacity: 0,
        maxCapacity: 1,
        roster: [],
        classDays: { dayOne: 'Monday', dayTwo: 'Wednesday'},
        startTime: "09:00",
        endTime: "10:15",
        courseStartDate: "09-02-2021",
        courseEndDate: "12-02-2021",
        enrollmentDeadline: "08-02-2021",
        isCourseFull: false
    },
    //Course 2
    {
        courseNumber: "370",
        courseSection: "30",
        courseUniqueID: "370-30",
        courseName: "Software Engineering",
        dept: "Computer Science",
        instructor: "Stro Show",
        description: "Learn software engineering techniques",
        semester: "Fall 2021",
        currentCapacity: 5,
        maxCapacity: 5,
        roster: [],
        classDays: { dayOne: 'Tuesday', dayTwo: 'Thursday'},
        startTime: "03:00",
        endTime: "04:15",
        courseStartDate: "09-02-2021",
        courseEndDate: "12-02-2021",
        enrollmentDeadline: "08-02-2021",
        isCourseFull: true
    },

    //Course 3
    {
        courseNumber: "370",
        courseSection: "05",
        courseUniqueID: "370-05",
        courseName: "Software Engineering",
        dept: "Computer Science",
        instructor: "Stro Show",
        description: "Learn software engineering techniques",
        semester: "Fall 2021",
        currentCapacity: 0,
        maxCapacity: 5,
        roster: [],
        classDays: { dayOne: 'Monday', dayTwo: 'Wednesday'},
        startTime: "03:00",
        endTime: "04:15",
        courseStartDate: "09-02-2021",
        courseEndDate: "12-02-2021",
        enrollmentDeadline: "08-02-2021",
        isCourseFull: false
    },

    //Course 4
    {
        courseNumber: "370",
        courseSection: "07",
        courseUniqueID: "370-07",
        courseName: "Software Engineering",
        dept: "Computer Science",
        instructor: "Stro Show",
        description: "Learn software engineering techniques",
        semester: "Fall 2021",
        currentCapacity: 0,
        maxCapacity: 5,
        roster: [],
        classDays: { dayOne: 'Tuesday', dayTwo: 'Friday'},
        startTime: "07:30",
        endTime: "08:45",
        courseStartDate: "09-02-2021",
        courseEndDate: "12-02-2021",
        enrollmentDeadline: "08-02-2021",
        isCourseFull: false
    }
]

exports.popDBCourses = function(req, res) {
    Course.collection.insertMany(coursesArray, function (err, docs) {
        if (err){ 
            return console.error(err);
        } else {
        console.log("Multiple Courses documents inserted to Collection");
        console.log("New id " + coursesArray[0]._id);
        console.log("New id " + coursesArray[1]._id);
        console.log("New id " + coursesArray[2]._id);
        console.log("New id " + coursesArray[3]._id);
        }
    });
};

//#rowID= course.get("courseSection")


const usersArray = [
    //user 1 - student
    {
      email: "120@gmail.com",
      password: bcrypt.hashSync("123", bcrypt.genSaltSync(8), null),
      firstname: "Peter", 
      lastname: "Al",
      courseid: [],
      role: "student"
    },
    //user 2 - instructor
    {
        email: "122@gmail.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(8), null),
        firstname: "Jake", 
        lastname: "deGoat",
        courseid: [],
        role: "instructor"
    },
    //user 3 - student 
    {
        email: "124@gmail.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(8), null),
        firstname: "Tom", 
        lastname: "Neato",
        courseid: [],
        role: "student"
    },
    //user 4 - instructor
    {
        email: "111@gmail.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(8), null),
        firstname: "Stro", 
        lastname: "Show",
        courseid: [],
        role: "instructor"
    },
]

exports.popDBUser = function(req, res) {
    User.collection.insertMany(usersArray, function (err, docs) {
        if (err){ 
            return console.error(err);
        } else {
        console.log("Multiple User documents inserted to Collection");
        }
    });
};

exports.addCoursesForUsers = async function(req, res){
    const student = await User.findOne( { email: "120@gmail.com" } );
    student.courseid = ["60a6de02c0e4eeaa980c93f0"];
    // console.log(coursesArray[0]._id);
    const doc = await student.save();
    console.log(doc);
}

exports.deleteCourseFromUser = async function(req, res){
    const courseId = "60a6de02c0e4eeaa980c93f0";
    // const student = await User.findOne( { email: "120@gmail.com" } );
    // student.courseid.pull( { _id: courseId});
    // console.log("SECOND ONE: ")
    // const doc = await student.save();
    // console.log(doc);

    User.findOne({email: "120@gmail.com"}, function(err,result){
        if (err) {
            console.log(err);            
        }else{
            result.courseid.pull(courseId);
            result.save();
        }
    })
}
