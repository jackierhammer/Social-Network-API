// imports mongodb
const mongoose = require('mongoose');

// wrap Mongoose around local connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/socialnetworkDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// exports connection 
module.exports = mongoose.connection;