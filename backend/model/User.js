
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  height: {
    type: String,
    required: true,
  },

  weight: {
    type: Number,
    required: true,
  },

  activityLevel: {
    type: String,
    required: true,
  },

  goal: {
    type: String,
    required: true,
  },

  dailyCalorie: {
    type: Number,
    required: true,
  },

  macronutrients: [{name: String, value: Number}],

  currentDate:{
    type: Date,
    required: true,
  }

})

module.exports = mongoose.model('User', userSchema);
