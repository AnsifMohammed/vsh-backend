const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
    },
    specialty: {
      type: String,
      required: true,
    },
    preferredDoctor: {
      type: String,
      default: "Any doctor",
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    additionalNotes: {
      type: String,
    },
    sendReminder: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
    },
    userId: {
      type: String,
    },
    bookedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
