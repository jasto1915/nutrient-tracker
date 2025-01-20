
const mongoose = require('mongoose');

const mealSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  servingQty: {
    type: Number,
    required: true,
  },

  servingUnit: {
    type: String,
    required: true,
  },

  servingWeightGram: {
    type: Number,
    required: true,
  },

  protein: {
    type: Number,
    required: true,
  },

  calories: {
    type: Number,
    required: true,
  },

  carbs: {
    type: Number,
    required: true,
  },

  fats:{
    type: Number,
    required: true,
  },

  time: {
    type: String,
    required: true,
  }

})

module.exports = mongoose.model('Meal', mealSchema);
