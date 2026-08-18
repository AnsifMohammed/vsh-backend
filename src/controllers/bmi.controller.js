const BMI = require("../models/bmi");


exports.createBMICalculation = async (req, res) => {
  try {
    const { height, weight } = req.body;
    const numHeight = Number(height);
    const numWeight = Number(weight);

    if (!height || !weight || isNaN(numHeight) || isNaN(numWeight) || numHeight <= 0 || numWeight <= 0) {
      return res.status(400).json({ message: "Valid positive height and weight are required" });
    }

    const heightM = numHeight / 100;
    const bmiValue = numWeight / (heightM * heightM);

    let category = "";
    let message = "";

    if (bmiValue < 18.5) {
      category = "Underweight";
      message =
        "Your BMI is below the healthy range. You may benefit from improved nutrition and professional guidance.";
    } else if (bmiValue < 25) {
      category = "Normal";
      message =
        "Your BMI is within the healthy range. Maintain a balanced diet and active lifestyle.";
    } else if (bmiValue < 30) {
      category = "Overweight";
      message =
        "Your BMI is slightly above the healthy range. Small lifestyle changes can improve overall health.";
    } else {
      category = "Obese";
      message =
        "Your BMI is significantly above the healthy range. Medical guidance can help support long-term well-being.";
    }

    const bmi = Number(bmiValue.toFixed(1));

    // ✅ SAVE TO DB
    const record = await BMI.create({
      height,
      weight,
      bmi,
      category,
      message
    });

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestBMICalculation = async (req, res) => {
  try {
    // ✅ FETCH LATEST BMI FROM DB
    const latestBMI = await BMI.findOne().sort({ createdAt: -1 });

    if (!latestBMI) {
      return res.status(404).json({ message: "No BMI data found" });
    }

    res.status(200).json({
      success: true,
      data: latestBMI
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
