
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
    type: Number,
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

  currentDateId:{
    type: String,
    required: true,
  }

})

module.exports = mongoose.model('User', userSchema);
