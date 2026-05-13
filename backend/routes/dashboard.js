const express = require("express");
const Student = require("../models/Student");
const Staff = require("../models/Staff");
const Event = require("../models/Event");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const [totalStudents, totalStaff, totalEvents] = await Promise.all([
      Student.countDocuments(),
      Staff.countDocuments(),
      Event.countDocuments()
    ]);
    

    

    const studentDistribution = await Student.aggregate([
      {
        $lookup: {
          from: 'standards',
          localField: 'standard',
          foreignField: '_id',
          as: 'standard'
        }
      },
      {
        $unwind: {
          path: "$standard",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $group: {
          _id: "$standard.standard",
          Boy: { $sum: { $cond: [{ $eq: ["$gender", "Male"] }, 1, 0] } },
          Girl: { $sum: { $cond: [{ $eq: ["$gender", "Female"] }, 1, 0] } }
        }
      },
      {
        $project: {
          grade: "$_id",
          Boy: 1,
          Girl: 1,
          _id: 0
        }
      },
      { $sort: { grade: 1 } }
    ]);

const localNow = new Date();
const todayUTC = new Date(Date.UTC(localNow.getFullYear(), localNow.getMonth(), localNow.getDate()));

console.log("Local Now:", localNow);
console.log("UTC Today:", todayUTC);


const testEvents = await Event.find({ startDate: { $gte: todayUTC } });
console.log("Matching Events (from DB):", testEvents.length, testEvents);

const upcomingEventsRaw = await Event.aggregate([
  {
    $match: {
      startDate: { $gte: todayUTC }
    }
  },
  {
    $project: {
      day: {
        $dateToString: { format: "%d %b", date: "$startDate", timezone: "UTC" }
      },
      time: {
        $dateToString: { format: "%H:%M", date: "$startDate", timezone: "UTC" }
      },
      name: "$title",
      color: { $ifNull: ["$color", "bg-gray-400"] }
    }
  },
  {
    $group: {
      _id: "$day",
      events: {
        $push: {
          time: "$time",
          name: "$name",
          color: "$color"
        }
      }
    }
  },
  { $sort: { _id: 1 } }
]);


    const upcomingEvents = upcomingEventsRaw.map(d => ({
      day: d._id,
      events: d.events
    }));

    res.json({
      totalStudents,
      totalStaff,
      totalEvents,
      studentDistribution,
      upcomingEvents
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err); 
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});


module.exports = router;
