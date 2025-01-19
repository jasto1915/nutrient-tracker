
const mongoose = require('mongoose');

const daySchema = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },

  calorieProgress: {
    type: Number,
    required: true,
  },

  proteinProgress: {
    type: String,
    required: true,
  },

  fatsProgress: {
    type: Number,
    required: true,
  },

  carbsProgress: {
    type: Number,
    required: true,
  },
  mealList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }],

})

module.exports = mongoose.model('Day', daySchema);
