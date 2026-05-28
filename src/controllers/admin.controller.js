const Appointment = require("../models/appointments");
const User = require("../models/user");

/**
 * @desc Get admin dashboard stats
 * @route GET /api/admin/stats
 */
exports.getAdminStats = async (req, res) => {
  try {
    // Get total appointments
    const totalAppointments = await Appointment.countDocuments();
    
    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = await Appointment.countDocuments({
      preferredDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Get upcoming appointments (next 7 days)
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingAppointments = await Appointment.countDocuments({
      preferredDate: {
        $gte: today,
        $lt: nextWeek
      }
    });

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get appointments by specialty
    const appointmentsBySpecialty = await Appointment.aggregate([
      {
        $group: {
          _id: "$specialty",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get recent appointments (last 5)
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName specialty preferredDate preferredTime phoneNumber createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalAppointments,
          todayAppointments,
          upcomingAppointments,
          totalUsers
        },
        appointmentsBySpecialty,
        recentAppointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      error: error.message
    });
  }
};

/**
 * @desc Get all appointments (for admin)
 * @route GET /api/admin/appointments
 */
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, date, specialty, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by specialty if provided
    if (specialty && specialty !== 'all') {
      query.specialty = specialty;
    }
    
    // Filter by date if provided
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.preferredDate = {
        $gte: searchDate,
        $lt: nextDay
      };
    }

    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message
    });
  }
};

/**
 * @desc Update appointment status
 * @route PUT /api/admin/appointments/:id
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, updatedAt: new Date() },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message
    });
  }
};

/**
 * @desc Delete appointment
 * @route DELETE /api/admin/appointments/:id
 */
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
      error: error.message
    });
  }
};

/**
 * @desc Get appointment details
 * @route GET /api/admin/appointments/:id
 */
exports.getAppointmentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment details",
      error: error.message
    });
  }
};