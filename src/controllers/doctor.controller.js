const Doctor = require("../models/doctor");

/**
 * @desc Get all doctors sorted by order
 * @route GET /api/doctors
 */
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};

/**
 * @desc Get single doctor details
 * @route GET /api/doctors/:id
 */
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctor details",
      error: error.message,
    });
  }
};

/**
 * @desc Create new doctor profile
 * @route POST /api/admin/doctors
 */
exports.createDoctor = async (req, res) => {
  try {
    const { name, degree, experience, image, specialties, education } = req.body;

    if (!name || !degree || !experience) {
      return res.status(400).json({
        success: false,
        message: "Name, degree, and experience fields are required",
      });
    }

    // Get max order value
    const maxDoctor = await Doctor.findOne().sort({ order: -1 }).select("order");
    const nextOrder = maxDoctor ? maxDoctor.order + 1 : 1;

    const doctor = new Doctor({
      name,
      degree,
      experience,
      image,
      specialties: Array.isArray(specialties)
        ? specialties
        : specialties
        ? specialties.split(",").map((s) => s.trim())
        : [],
      education,
      order: nextOrder,
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create doctor profile",
      error: error.message,
    });
  }
};

/**
 * @desc Update doctor profile
 * @route PUT /api/admin/doctors/:id
 */
exports.updateDoctor = async (req, res) => {
  try {
    const { name, degree, experience, image, specialties, education } = req.body;

    const updatedData = {
      name,
      degree,
      experience,
      image,
      education,
      specialties: Array.isArray(specialties)
        ? specialties
        : specialties
        ? specialties.split(",").map((s) => s.trim())
        : [],
    };

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update doctor profile",
      error: error.message,
    });
  }
};

/**
 * @desc Delete doctor profile
 * @route DELETE /api/admin/doctors/:id
 */
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete doctor profile",
      error: error.message,
    });
  }
};

/**
 * @desc Reorder doctors list
 * @route PUT /api/admin/doctors/reorder
 */
exports.updateDoctorOrders = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order }

    if (!Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        message: "orders array is required",
      });
    }

    const bulkOperations = orders.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));

    await Doctor.bulkWrite(bulkOperations);

    res.status(200).json({
      success: true,
      message: "Doctors reordered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update doctor ordering",
      error: error.message,
    });
  }
};
