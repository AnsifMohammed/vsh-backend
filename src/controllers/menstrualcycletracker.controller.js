const MenstrualCycleTracker = require("../models/menstrualcycletracker");


const createCyclePrediction = async (req, res) => {
  try {
    const { lastPeriodDate, cycleLength } = req.body;
    const numCycleLength = Number(cycleLength);
    if (!lastPeriodDate || !cycleLength || isNaN(numCycleLength) || numCycleLength <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid last period date and positive cycle length are required"
      });
    }

    const lastDate = new Date(lastPeriodDate);

    // Calculations
    const nextPeriodDate = new Date(lastDate);
    nextPeriodDate.setDate(lastDate.getDate() + numCycleLength);

    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(nextPeriodDate.getDate() - 14);

    const fertileWindowStart = new Date(ovulationDate);
    fertileWindowStart.setDate(ovulationDate.getDate() - 5);

    const fertileWindowEnd = new Date(ovulationDate);
    fertileWindowEnd.setDate(ovulationDate.getDate() + 1);

    const tracker = await MenstrualCycleTracker.create({
      lastPeriodDate,
      cycleLength,
      nextPeriodDate,
      ovulationDate,
      fertileWindowStart,
      fertileWindowEnd
    });

    res.status(201).json({
      success: true,
      data: tracker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const getLatestCyclePrediction = async (req, res) => {
  try {
    const tracker = await MenstrualCycleTracker.findOne().sort({ createdAt: -1 });

    if (!tracker) {
      return res.status(404).json({
        success: false,
        message: "No cycle data found"
      });
    }

    res.status(200).json({
      success: true,
      data: tracker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createCyclePrediction,
  getLatestCyclePrediction
};