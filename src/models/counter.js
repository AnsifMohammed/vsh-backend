const mongoose = require('mongoose');


const counterSchema = new mongoose.Schema(
  {
    familiesHelped: {
      type: Number,
      required: true
    },
    babiesDelivered: {
      type: Number,
      required: true
    },
    yearsExperience: {
      type: Number,
      required: true
    },
    googleRating: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Counter', counterSchema);