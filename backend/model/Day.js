
const mongoose = require('mongoose');

const daySchema = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },

  dateId:{
    type: Number,
    required: true,
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
