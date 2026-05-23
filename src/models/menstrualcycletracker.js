const mongoose = require("mongoose");

const cycleTrackerSchema = new mongoose.Schema(
  {
    lastPeriodDate: {
      type: Date,
      required: true
    },
    cycleLength: {
      type: Number,
      required: true
    },
    nextPeriodDate: Date,
    ovulationDate: Date,
    fertileWindowStart: Date,
    fertileWindowEnd: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("CycleTracker", cycleTrackerSchema);
