const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const userSchema = require('../models/User').schema;

const courseSchema = new Schema({
    courseNumber: String,
    courseSection: String,
    courseUniqueID: { type: String, unique: true },
    courseName: String,
    dept: String,
    instructor: String,
    description: String,
    semester: String,
    currentCapacity: Number,
    maxCapacity: Number,
    roster: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Users', require: false } ], //reference to the associated Users
    // classDays: { dayOne: String, dayTwo: String },
    // classTime: String,
    courseStartDate: Date,
    courseEndDate: Date,
    enrollmentDeadline: Date,
    isCourseFull: Boolean
});

module.exports = mongoose.model('Courses', courseSchema);
