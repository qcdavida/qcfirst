// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const Q = require('q');
// const config = require('./properties');
// const InitiateMongoServer = require("./db");
// InitiateMongoServer();

// exports.localReg = function (username, password){
//     const deferred = Q.defer();
//     console.log("hello, do you mean?");
//     const collection = mongoose.connection.collection('user');
//     collection.findOne({'username' : username})
//     .then(function (result) {
//         if (null != result) {
//           console.log("User already exists:", result.username);
//           deferred.resolve(false);
//         }
//         else {
//             const hash = bcrypt.hashSync(password, 8);
//             const user = {
//               "username": username,
//               "password": hash,
//               "email": email,
//               "firstname": firstname,
//               "lastname": lastname,
//               "isInstructor": false
//             }

//             console.log("New user created: ", firstname);
//             collection.insertOne(user)
//             .then(function () {
//               deferred.resolve(user);
//             });
//         }
//     });
//     return deferred.promise;
// };