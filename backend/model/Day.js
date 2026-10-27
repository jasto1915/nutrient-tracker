
const mongoose = require('mongoose');

const daySchema = mongoose.Schema({
  // Calendar date as YYYY-MM-DD, unique per day. This is both the identifier
  // and the date shown in the history, so it is stored once rather than twice.
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
