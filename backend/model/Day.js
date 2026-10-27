
const mongoose = require('mongoose');

const daySchema = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },

  // Calendar date as YYYY-MM-DD, unique per day.
  dateId:{
    type: String,
    required: true,
    unique: true,
  },

  macronutrientProgress: [{
    name: String,
    value: Number,
  }],


  mealList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }],

})

module.exports = mongoose.model('Day', daySchema);
