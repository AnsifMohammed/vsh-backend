const getGrowthData = (week) => {
  const allWeeks = [];
  const milestones = [
    { w: 1, f: "None", weight: "-", length: "-", hb: "Not yet", limb: "Not formed", organ: "Fertilization preparing" },
    { w: 2, f: "None", weight: "-", length: "-", hb: "Not yet", limb: "Not formed", organ: "Fertilization preparing" },
    { w: 3, f: "Vanilla Bean Seed", weight: "< 1g", length: "0.1mm", hb: "Not yet", limb: "Not formed", organ: "Cells dividing rapidly" },
    { w: 4, f: "Poppy Seed", weight: "< 1g", length: "2mm", hb: "Not yet", limb: "Not formed", organ: "Blastocyst implants in uterus" },
    { w: 5, f: "Apple Seed", weight: "< 1g", length: "3mm", hb: "Heart tubes forming", limb: "Not formed", organ: "Neural tube begins to form" },
    { w: 6, f: "Sweet Pea", weight: "< 1g", length: "4-6mm", hb: "Heart starts beating (~110 bpm)", limb: "Limb buds appear", organ: "Brain and spinal cord developing" },
    { w: 7, f: "Blueberry", weight: "1g", length: "10mm", hb: "Heartbeat detectable", limb: "Arm and leg buds growing", organ: "Kidneys and liver forming" },
    { w: 8, f: "Raspberry", weight: "1g", length: "16mm", hb: "Heart beating ~150-170 bpm", limb: "Fingers and toes webbed", organ: "Major organs forming" },
    { w: 9, f: "Green Olive", weight: "2g", length: "23mm", hb: "Heart valves forming", limb: "Arms and legs lengthen", organ: "Essential organs start working" },
    { w: 10, f: "Prune", weight: "4g", length: "31mm", hb: "Fully formed heart", limb: "Joints working", organ: "Brain growing rapidly" },
    { w: 11, f: "Fig", weight: "7g", length: "41mm", hb: "Heart pumping blood strongly", limb: "Fingers and toes separate", organ: "Tooth buds forming" },
    { w: 12, f: "Lime", weight: "14g", length: "54mm", hb: "Heartbeat audible via Doppler", limb: "Nails start forming", organ: "Digestive system working" },
    { w: 13, f: "Pea Pod", weight: "23g", length: "74mm", hb: "Strong heartbeat", limb: "Bones ossifying", organ: "Vocal cords developing" },
    { w: 14, f: "Lemon", weight: "43g", length: "8.7cm", hb: "Strong heartbeat", limb: "Can bend arms/legs", organ: "Kidneys producing urine" },
    { w: 15, f: "Apple", weight: "70g", length: "10.1cm", hb: "Strong heartbeat", limb: "Legs growing longer", organ: "Lungs begin practicing breathing" },
    { w: 16, f: "Avocado", weight: "100g", length: "11.6cm", hb: "Pumping ~25 quarts of blood/day", limb: "Joints moving smoothly", organ: "Nervous system functioning" },
    { w: 17, f: "Turnip", weight: "140g", length: "13cm", hb: "Regulated heartbeat", limb: "Skeleton hardening", organ: "Fat accumulating" },
    { w: 18, f: "Bell Pepper", weight: "190g", length: "14.2cm", hb: "Regulated heartbeat", limb: "Active movements (kicks)", organ: "Ears functioning, can hear" },
    { w: 19, f: "Tomato", weight: "240g", length: "15.3cm", hb: "Regulated heartbeat", limb: "Proportions normalizing", organ: "Brain areas specializing" },
    { w: 20, f: "Banana", weight: "300g", length: "25.6cm", hb: "Heartbeat loud and clear", limb: "Frequent movements", organ: "Swallowing mechanism practiced" },
    { w: 21, f: "Carrot", weight: "360g", length: "26.7cm", hb: "Heartbeat loud", limb: "Strong kicks", organ: "Digestive system maturing" },
    { w: 22, f: "Spaghetti Squash", weight: "430g", length: "27.8cm", hb: "Heartbeat loud", limb: "Grasping practice", organ: "Pancreas developing" },
    { w: 23, f: "Large Mango", weight: "500g", length: "28.9cm", hb: "Heartbeat loud", limb: "Movements more coordinated", organ: "Lungs preparing for outside" },
    { w: 24, f: "Ear of Corn", weight: "600g", length: "30cm", hb: "Heart rate 120-160 bpm", limb: "Reflexes improving", organ: "Viability milestone" },
    { w: 25, f: "Rutabaga", weight: "660g", length: "34.6cm", hb: "Heart rate 120-160 bpm", limb: "Exploring hands and feet", organ: "Capillaries forming" },
    { w: 26, f: "Scallion", weight: "760g", length: "35.6cm", hb: "Heart rate 120-160 bpm", limb: "Spine getting stronger", organ: "Eyes starting to open" },
    { w: 27, f: "Cauliflower", weight: "870g", length: "36.6cm", hb: "Heart rate 120-160 bpm", limb: "Active stretching", organ: "Brain growth accelerating" },
    { w: 28, f: "Large Eggplant", weight: "1kg", length: "37.6cm", hb: "Heart rate 120-160 bpm", limb: "Stronger muscle tone", organ: "Immune system developing" },
    { w: 29, f: "Butternut Squash", weight: "1.15kg", length: "38.6cm", hb: "Heart rate 120-160 bpm", limb: "Vigorous kicks", organ: "Bones fully developed" },
    { w: 30, f: "Cabbage", weight: "1.3kg", length: "39.9cm", hb: "Heart rate 120-160 bpm", limb: "Resting cycles established", organ: "Brain wrinkles forming" },
    { w: 31, f: "Coconut", weight: "1.5kg", length: "41.1cm", hb: "Heart rate 120-160 bpm", limb: "Less room to move", organ: "Lungs nearly mature" },
    { w: 32, f: "Jicama", weight: "1.7kg", length: "42.4cm", hb: "Heart rate 120-160 bpm", limb: "Head-down position likely", organ: "Skin becoming opaque" },
    { w: 33, f: "Pineapple", weight: "1.9kg", length: "43.7cm", hb: "Heart rate 120-160 bpm", limb: "Firm skeleton", organ: "Antibodies crossing placenta" },
    { w: 34, f: "Cantaloupe", weight: "2.1kg", length: "45cm", hb: "Heart rate 120-160 bpm", limb: "Refining movements", organ: "Nervous system mature" },
    { w: 35, f: "Honeydew", weight: "2.4kg", length: "46.2cm", hb: "Heart rate 120-160 bpm", limb: "Gaining fat rapidly", organ: "Kidneys fully developed" },
    { w: 36, f: "Romaine Lettuce", weight: "2.6kg", length: "47.4cm", hb: "Heart rate 120-160 bpm", limb: "Getting crowded", organ: "Lungs fully mature" },
    { w: 37, f: "Swiss Chard", weight: "2.8kg", length: "48.6cm", hb: "Heart rate 120-160 bpm", limb: "Practicing breathing", organ: "Considered early term" },
    { w: 38, f: "Leek", weight: "3kg", length: "49.8cm", hb: "Heart rate 120-160 bpm", limb: "Firm grasp", organ: "Organs ready for birth" },
    { w: 39, f: "Mini Watermelon", weight: "3.2kg", length: "50.7cm", hb: "Heart rate 120-160 bpm", limb: "Limbs tucked in", organ: "Shedding lanugo" },
    { w: 40, f: "Small Pumpkin", weight: "3.5kg", length: "51.2cm", hb: "Heart rate 120-160 bpm", limb: "Ready for birth", organ: "Fully developed" }
  ];

  // Curated fruit/produce images from Unsplash — matched to each week's baby size comparison
  const weekImages = {
    1: "https://images.unsplash.com/photo-1576179635662-9d1983e97e1e?w=400&h=400&fit=crop",
    2: "https://images.unsplash.com/photo-1576179635662-9d1983e97e1e?w=400&h=400&fit=crop",
    3: "https://images.unsplash.com/photo-1520637836993-a072bfd46be4?w=400&h=400&fit=crop",
    4: "https://images.unsplash.com/photo-1520637836993-a072bfd46be4?w=400&h=400&fit=crop",
    5: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=400&fit=crop",
    6: "https://images.unsplash.com/photo-1587049536183-d067c2b3f35d?w=400&h=400&fit=crop",
    7: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop",
    8: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
    9: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&h=400&fit=crop",
    10: "https://images.unsplash.com/photo-1562329265-95a6d7a83440?w=400&h=400&fit=crop",
    11: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=400&fit=crop",
    12: "https://images.unsplash.com/photo-1587137186009-f57a9e2e7fe8?w=400&h=400&fit=crop",
    13: "https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=400&h=400&fit=crop",
    14: "https://images.unsplash.com/photo-1590502160462-58b41354f588?w=400&h=400&fit=crop",
    15: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
    16: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop",
    17: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop",
    18: "https://images.unsplash.com/photo-1545601445-4d6a0a0565f0?w=400&h=400&fit=crop",
    19: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&h=400&fit=crop",
    20: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&h=400&fit=crop",
    21: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
    22: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=400&fit=crop",
    23: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop",
    24: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop",
    25: "https://images.unsplash.com/photo-1593040405209-b6cc0d6a9aa4?w=400&h=400&fit=crop",
    26: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop",
    27: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop",
    28: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
    29: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    30: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=400&fit=crop",
    31: "https://images.unsplash.com/photo-1582820271685-b2ba92897d91?w=400&h=400&fit=crop",
    32: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop",
    33: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop",
    34: "https://images.unsplash.com/photo-1571575173700-afb9492d5bff?w=400&h=400&fit=crop",
    35: "https://images.unsplash.com/photo-1571575173700-afb9492d5bff?w=400&h=400&fit=crop",
    36: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop",
    37: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop",
    38: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop",
    39: "https://images.unsplash.com/photo-1587049277714-f1e52b6a3e43?w=400&h=400&fit=crop",
    40: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=400&fit=crop"
  };

  for (let i = 1; i <= 40; i++) {
    const m = milestones.find(m => m.w === i) || milestones[milestones.length - 1];
    allWeeks.push({
      week: i,
      fruit: m.f,
      weight: m.weight,
      length: m.length,
      heartbeat: m.hb,
      limb: m.limb,
      organ: m.organ,
      image: weekImages[i] || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop"
    });
  }

  const currentGrowth = allWeeks[week - 1] || allWeeks[0];
  return { currentGrowth, allWeeks };
};

exports.createPregnancyPrediction = async (req, res) => {
  try {
    const { cycleLength } = req.body;
    const lastMenstrualPeriod = req.body.lastMenstrualPeriod || req.body.lastPeriodDate || req.body.firstDayOfLastPeriod;

    if (!lastMenstrualPeriod) {
      return res.status(400).json({ message: "Last menstrual period is required" });
    }

    const numCycleLength = cycleLength ? Number(cycleLength) : 28;
    if (isNaN(numCycleLength) || numCycleLength <= 0) {
      return res.status(400).json({ message: "Cycle length must be a positive number" });
    }

    const start = new Date(lastMenstrualPeriod);
    start.setDate(start.getDate() + (numCycleLength - 28));

    const today = new Date();
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));

    const pregnancyWeek = Math.max(1, Math.floor(diffDays / 7) + 1);

    const expectedDeliveryDate = new Date(start);
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 280);

    const trimester =
      pregnancyWeek <= 12 ? "First Trimester" :
        pregnancyWeek <= 27 ? "Second Trimester" :
          "Third Trimester";

    const growthData = getGrowthData(pregnancyWeek);

    const data = {
      pregnancyWeek,
      trimester,
      expectedDeliveryDate,
      growth: growthData.currentGrowth,
      allGrowthData: growthData.allWeeks,
      medicalInfo: {
        doctorVisit: "Regular prenatal checkups recommended",
        supplements: "Folic acid, iron, calcium",
        advice: "Avoid alcohol, smoking, and stress"
      }
    };

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestPregnancyPrediction = async (req, res) => {
  try {
    // mock data
    const pregnancyWeek = 8;
    const growthData = getGrowthData(pregnancyWeek);
    res.status(200).json({
      success: true,
      data: {
        pregnancyWeek,
        trimester: "First Trimester",
        expectedDeliveryDate: "2026-08-14",
        growth: growthData.currentGrowth,
        allGrowthData: growthData.allWeeks,
        medicalInfo: {
          doctorVisit: "Regular prenatal checkups recommended",
          supplements: "Folic acid, iron, calcium",
          advice: "Avoid alcohol, smoking, and stress"
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
