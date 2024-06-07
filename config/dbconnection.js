//dbconnection.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://FitnessQuest:Saksham123@fitnessquest.4oicwkm.mongodb.net/UserData')
	.then(() => console.log('Connected to MongoDB!'))
	.catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;