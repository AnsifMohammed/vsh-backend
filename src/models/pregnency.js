const mongoose = require("mongoose");

const PregnancySchema = new mongoose.Schema(
  {
    lastMenstrualPeriod: { type: Date, required: true },
    cycleLength: { type: Number, default: 28, min: [1, "Cycle length must be at least 1 day"] },

    pregnancyWeek: Number,
    trimester: String,
    expectedDeliveryDate: Date,

    medicalInfo: {
      doctorVisit: { type: String, default: "Regular prenatal checkups recommended" },
      supplements: { type: String, default: "Folic acid, iron, calcium" },
      advice: { type: String, default: "Avoid alcohol, smoking, and stress" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pregnancy", PregnancySchema);
