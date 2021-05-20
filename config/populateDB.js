const Course = require('../models/Course');
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// const InitiateMongoServer = require("./config/db");
// InitiateMongoServer();

// const db = mongoose.connection;
// db.once('open', _ => {
//   console.log('Database connected:', url)
// })

// db.on('error', err => {
//   console.error('connection error:', err)
// })

const coursesArray = [
    {
        courseid: 355,
        courseSection: 4,
        coursename: "Web Tech",
        dept: "Computer Science",
        instructor: "Jake deGoat",
        description: "Learnt to develop web apps",
        semester: "Fall 2021",
        roster: [],
        courseStartDate: "09-02-2021",
        enrollmentDeadline: "12-02-2021",
        status: true, 
        credits: 3,
    },
    //Course 2
    {
        courseid: 370,
        courseSection: 1,
        coursename: "Software Engineering",
        dept: "Computer Science",
        instructor: "Stro Show",
        description: "Learn software engineering techniques",
        semester: "Fall 2021",
        roster: [],
        courseStartDate: "09-02-2021",
        enrollmentDeadline: "12-02-2021",
        status: true,
        credits: 3,
    },

    //Course 3
    {
        courseid: 370,
        courseSection: 5,
        coursename: "Software Engineering",
        dept: "Computer Science",
        instructor: "Stro Show",
        description: "Learn software engineering techniques",
        semester: "Fall 2021",
        roster: [],
        courseStartDate: "09-02-2021",
        enrollmentDeadline: "12-02-2021",
        status: true,
        credits: 3,
    },

    //Course 4
    {
        courseid: 370,
        courseSection: 7,
        coursename: "Software Engineering",
        dept: "Computer Science",
        instructor: "Stro Show",
        description: "Learn software engineering techniques",
        semester: "Fall 2021",
        roster: [],
        courseStartDate: "09-02-2021",
        enrollmentDeadline: "12-02-2021",
        status: false,
        credits: 3,
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


const usersArray = [
    //user 1 - student
    {
      email: "120@gmail.com",
      password: bcrypt.hashSync("123", bcrypt.genSaltSync(8), null),
      firstname: "Peter", 
      lastname: "Al",
      courseid: [coursesArray[0]._id, coursesArray[1]._id],
      role: "student"
    },
    //user 2 - instructor
    {
        email: "122@gmail.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(8), null),
        firstname: "Jake", 
        lastname: "deGoat",
        courseid: [coursesArray[0]._id],
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
        courseid: [coursesArray[1]._id, coursesArray[2]._id, coursesArray[3]._id],
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
