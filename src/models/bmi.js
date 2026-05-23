const mongoose = require("mongoose");

const BMISchema = new mongoose.Schema(
  {
    height: {
      type: Number, // cm
      required: true,
      min: 50
    },
    weight: {
      type: Number, // kg
      required: true,
      min: 10
    },
    bmi: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: ["Underweight", "Normal", "Overweight", "Obese"],
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("BMI", BMISchema);
