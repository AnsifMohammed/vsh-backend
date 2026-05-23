const Counter = require('../models/counter');

const getCounters = async (req, res) => {
  try {
    const counter = await Counter.findOne().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: counter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addCounters = async (req, res) => {
  try {
    const counter = await Counter.create(req.body);
    res.status(201).json({ success: true, data: counter });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCounters = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCounter = await Counter.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCounter) {
      return res.status(404).json({
        success: false,
        message: 'Counter not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCounter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteCounters = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCounter = await Counter.findByIdAndDelete(id);

    if (!deletedCounter) {
      return res.status(404).json({
        success: false,
        message: 'Counter not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Counter deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCounters,
  addCounters,
  updateCounters,
  deleteCounters
};
