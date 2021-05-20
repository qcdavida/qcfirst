const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const userSchema = require('../models/User').schema;

const courseSchema = new Schema({
    courseNumber: { type: String, unique: true},
    courseName: String,
    dept: String,
    instructor: String,
    description: String,
    semester: String,
    currentCapacity: Number,
    maxCapacity: Number,
    roster: [ { type: Schema.Types.ObjectId, ref: 'Users' } ], //reference to the associated Users
    // daysOfWeek: [ String ],
    // classtime: Date,
    courseStartDate: Date,
    courseEndDate: Date,
    enrollmentDeadline: Date,
    isCourseFull: Boolean,
    credits: { type: Number, min: 1, max: 4, required: true }
});

module.exports = mongoose.model('Courses', courseSchema);
