const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://FitnessQuest:Saksham123@fitnessquest.4oicwkm.mongodb.net/UserData?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


  module.exports = mongoose;