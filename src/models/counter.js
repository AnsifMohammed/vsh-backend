const mongoose = require('mongoose');


const counterSchema = new mongoose.Schema(
  {
    familiesHelped: {
      type: Number,
      required: true,
      min: [0, "Families helped cannot be negative"]
    },
    babiesDelivered: {
      type: Number,
      required: true,
      min: [0, "Babies delivered cannot be negative"]
    },
    yearsExperience: {
      type: Number,
      required: true,
      min: [0, "Years experience cannot be negative"]
    },
    googleRating: {
      type: Number,
      required: true,
      min: [0, "Google rating cannot be negative"],
      max: [5, "Google rating cannot exceed 5"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Counter', counterSchema);