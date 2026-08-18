const Ovulation = require("../models/ovulation");

exports.createOvulationPrediction = async (req, res) => {
  try {
    const { cycleLength } = req.body;
    const firstDayOfLastPeriod = req.body.firstDayOfLastPeriod || req.body.lastPeriodDate || req.body.lastMenstrualPeriod;
    const numCycleLength = Number(cycleLength || 28);

    if (!firstDayOfLastPeriod || isNaN(numCycleLength) || numCycleLength <= 0) {
      return res.status(400).json({
        message: "First day of last period and positive cycle length are required"
      });
    }

    const startDate = new Date(firstDayOfLastPeriod);

    // Ovulation ≈ cycleLength - 14
    const ovulationDate = new Date(startDate);
    ovulationDate.setDate(startDate.getDate() + (numCycleLength - 14));

    const fertileWindowStart = new Date(ovulationDate);
    fertileWindowStart.setDate(ovulationDate.getDate() - 4);

    const fertileWindowEnd = new Date(ovulationDate);
    fertileWindowEnd.setDate(ovulationDate.getDate() + 1);

    const record = await Ovulation.create({
      firstDayOfLastPeriod,
      cycleLength,
      ovulationDate,
      fertileWindowStart,
      fertileWindowEnd
    });

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestOvulationPrediction = async (req, res) => {
  try {
    const latest = await Ovulation.findOne().sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No ovulation data found" });
    }

    res.status(200).json({
      success: true,
      data: latest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
