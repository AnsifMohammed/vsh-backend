const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      lowercase: true
    },
    serviceInterestedIn: {
      type: String
    },
    message: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('consultation', consultationSchema);
