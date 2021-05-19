const mongoose = require('mongoose');
const config = require('./properties');

const InitiateMongoServer = async () => {
    try {
      await mongoose.connect(config.mongoURL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      });
      console.log("Connected to Mongoose DB");
    } catch (err) {
      console.log(err);
      throw err;
    }
};
  
module.exports = InitiateMongoServer;