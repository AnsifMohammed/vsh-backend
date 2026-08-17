const express = require("express");
const router = express.Router();
const checkAdmin = require('../middlewares/role.middleware');
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorOrders
} = require("../controllers/doctor.controller");
const { getCounters, addCounters, updateCounters, deleteCounters } = require('../controllers/counter.controller');
const {createRequest,getAllRequests,getRequestById,updateRequest,deleteRequest} = require('../controllers/consultation.controller')
const {createCyclePrediction,getLatestCyclePrediction} = require("../controllers/menstrualcycletracker.controller");
const {createPregnancyPrediction, getLatestPregnancyPrediction} = require("../controllers/pregnency.controller");
const {createBMICalculation, getLatestBMICalculation} = require("../controllers/bmi.controller");
const {createOvulationPrediction, getLatestOvulationPrediction} = require("../controllers/ovulation.contoller");
const {createAppointment, getAppointments, getAppointmentById} = require("../controllers/appointment.controller");
const { 
  signup, 
  login, 
  forgotPassword, 
  resetPassword, 
  verifyResetToken 
} = require("../controllers/auth.controller");
const {
  getAdminStats,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentDetails
} = require("../controllers/admin.controller");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  togglePublishStatus,
  getBlogStats,
  getPublishedBlogs,
  getBlogBySlug
} = require("../controllers/blog.controller");


//Auth

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.get('/auth/verify-reset-token/:token', verifyResetToken);

// Admin routes
router.get('/admin/stats', checkAdmin, getAdminStats);
router.get('/admin/appointments', checkAdmin, getAllAppointments);
router.get('/admin/appointments/:id', checkAdmin, getAppointmentDetails);
router.put('/admin/appointments/:id', checkAdmin, updateAppointmentStatus);
router.delete('/admin/appointments/:id', checkAdmin, deleteAppointment);

// counter
router.get('/counters', getCounters);
router.post('/counters',checkAdmin, addCounters);
router.put('/counters',checkAdmin, updateCounters);
router.delete('/counters',checkAdmin, deleteCounters);

// consultation form
router.get('/consultation',checkAdmin, getAllRequests);
router.post('/consultation', createRequest);
router.put('/consultation',checkAdmin, updateRequest);
router.delete('/consultation',checkAdmin, deleteRequest);

// mentrualcycletracker
router.post("/menstrual-cycle-tracker", createCyclePrediction);
router.get("/menstrual-cycle-tracker", getLatestCyclePrediction);

// pregnency tracker
router.post("/pregnancy", createPregnancyPrediction);
router.get("/pregnancy", getLatestPregnancyPrediction);

// bmi tracker
router.post("/bmi", createBMICalculation);
router.get("/bmi", getLatestBMICalculation);

// ovulation tracker
router.post("/ovulation", createOvulationPrediction);
router.get("/ovulation", getLatestOvulationPrediction);



router.post("/appointments", createAppointment);      // POST
router.get("/appointments", checkAdmin, getAppointments);          // GET all
router.get("/appointments/:id", checkAdmin, getAppointmentById);

// Public Blog routes
router.get('/blogs', getPublishedBlogs);
router.get('/blogs/:slug', getBlogBySlug);

// Admin Blog routes
router.post('/admin/blogs', checkAdmin, createBlog);
router.get('/admin/blogs', checkAdmin, getAllBlogs);
router.get('/admin/blogs/stats', checkAdmin, getBlogStats);
router.get('/admin/blogs/:id', checkAdmin, getBlogById);
router.put('/admin/blogs/:id', checkAdmin, updateBlog);
router.delete('/admin/blogs/:id', checkAdmin, deleteBlog);
router.put('/admin/blogs/:id/publish', checkAdmin, togglePublishStatus);

// Public Doctor routes
router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);

// Admin Doctor routes
router.post('/admin/doctors', checkAdmin, createDoctor);
router.put('/admin/doctors/reorder', checkAdmin, updateDoctorOrders);
router.put('/admin/doctors/:id', checkAdmin, updateDoctor);
router.delete('/admin/doctors/:id', checkAdmin, deleteDoctor);

module.exports = router;
