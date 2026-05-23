const mongoose = require("mongoose");

const OvulationSchema = new mongoose.Schema(
  {
    firstDayOfLastPeriod: {
      type: Date,
      required: true
    },
    cycleLength: {
      type: Number,
      required: true,
      min: 20,
      max: 45
    },
    ovulationDate: {
      type: Date,
      required: true
    },
    fertileWindowStart: {
      type: Date,
      required: true
    },
    fertileWindowEnd: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ovulation", OvulationSchema);
