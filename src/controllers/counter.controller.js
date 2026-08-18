const Counter = require('../models/counter');

const getCounters = async (req, res) => {
  try {
    const counter = await Counter.findOne().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: counter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const validateCounterValues = (data) => {
  const fields = ['familiesHelped', 'babiesDelivered', 'yearsExperience', 'googleRating'];
  for (const field of fields) {
    if (data[field] !== undefined) {
      const val = Number(data[field]);
      if (isNaN(val) || val < 0) {
        return `${field} cannot be negative`;
      }
      if (field === 'googleRating' && val > 5) {
        return 'googleRating cannot exceed 5';
      }
    }
  }
  return null;
};

const addCounters = async (req, res) => {
  try {
    const errorMsg = validateCounterValues(req.body);
    if (errorMsg) {
      return res.status(400).json({ success: false, message: errorMsg });
    }
    const counter = await Counter.create(req.body);
    res.status(201).json({ success: true, data: counter });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCounters = async (req, res) => {
  try {
    const { id } = req.params;

    const errorMsg = validateCounterValues(req.body);
    if (errorMsg) {
      return res.status(400).json({ success: false, message: errorMsg });
    }

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
