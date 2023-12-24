const BeaconData = require("../models/BeaconModel.js").default;
const BeaconData1 = require("../models/BeaconModel.js").BeaconData1;
const BeaconStatus = require("../models/beaconStatus.js").BeaconStatus;
const csv = require("fast-csv");
const fs = require("fs");

// export const newActivity = (req, res) => {
//   const { name, status } = req.body;

//   const beaconSchema = new BeaconData({ name, status });

//   beaconSchema
//     .save()
//     .then(() => res.json({ message: "Activity added successfully" }))
//     .catch((error) => res.status(500).json({ error: "Error adding activity" }));
// };

exports.getStartStatus = async function (req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const search = Number(req.query.search);
    let matchQuery = {};
    if (!isNaN(search)) {
      matchQuery.$or = [{ walk: search }, { device_id: req.query.search }];
    } else if (req.query.search) {
      matchQuery.device_id = req.query.search;
    }

    const pipeline = [
      { $match: matchQuery },
      { $sort: { walk: -1 } },
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ];
    const beaconStatusSchema = await BeaconStatus.aggregate(pipeline);
    const docCount = await BeaconStatus.countDocuments(matchQuery);
    const totalPages = Math.ceil(docCount / limit);

    return res.status(200).json({
      status: true,
      count: docCount,
      totalPages,
      beaconList: beaconStatusSchema,
    });
  } catch (error) {
    console.log("beaconlist error: ", error);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};

exports.deleteBeaconStatus = async function (req, res) {
  const { id } = req.query;

  try {
    // Find and delete beacon status by ID
    const deletedBeaconStatus = await BeaconStatus.deleteOne({ walk: id });
    if (!deletedBeaconStatus) {
      return res.status(404).json({ status: false, message: "Not found" });
    }
    const deletedBeaconDetails = await BeaconData1.deleteMany({ walkID: id });

    if (!deletedBeaconDetails) {
      return res.status(404).json({ status: false, message: "Not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Beacon status deleted successfully",
      deletedBeaconStatus,
    });
  } catch (error) {
    console.error("deleteBeaconStatus error: ", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getBeacon = async function (req, res) {
  const limit = 50;
  const page = req.query.page;
  const walkID = req.query.walkID;

  const modifiedWalkID = Number(walkID);

  const pipeline = [
    // { $skip: (page - 1) * parseInt(limit) },
    // { $skip: 20 },
    // { $match: { deviceID: "44565" } },
    { $match: { walkID: modifiedWalkID } },
    // { $limit: parseInt(limit) },
    {
      $addFields: {
        timeStamp: {
          $toDate: {
            $toLong: "$timeStamp",
          },
        },
      },
    },
    {
      $project: {
        xMP: 1,
        yMP: 1,
        xMP0: 1,
        xMP1: 1,
        // macAddress: 1,
        // device_id: 1,
        deviceID: 1,

        sensorSpeed: 1,
        sensorTime: 1,
        sensorDirection: 1,

        bXMP: 1,
        bYMP: 1,

        beaconDetail: 1,
        beaconData: 1,
        walk: 1,
        time: 1,
        // UUID: 1,
        timeStamp: {
          $dateToString: {
            format: "%d-%m-%Y %H:%M:%S",
            date: "$timeStamp",
          },
        },
      },
    },
  ];

  try {
    const beaconSchema = await BeaconData1.aggregate(pipeline);

    // const modifiedArray = beaconSchema.filter(
    //   (_, index) => (index + 1) % 10 === 1
    // );

    // res.status(200).json(modifiedArray);
    res.status(200).json(beaconSchema);
  } catch (error) {
    console.log("Get Beacons Error", error);
  }

  // res.status(200).json(beaconSchema);
};

exports.downloadCSV = async (req, res) => {
  try {
    const { id } = req.query;

    // Fetch users from MongoDB
    const users = await BeaconData1.find(
      { walkID: id },
      "device_id beaconDetail time timeStamp xMP yMP xMP0 xMP1 yMP1 bXMP bYMP sensorSpeed sensorTime sensorDirection walkID"
    );

    // Create a CSV stream
    const csvStream = csv.format({ headers: true });

    // Pipe the CSV stream to a file
    const writeStream = fs.createWriteStream("users.csv");
    csvStream.pipe(writeStream);

    // Write users data to the CSV stream
    users.forEach((user) => {
      // Adjust the data format to match your CSV structure
      const formattedData = {
        device_id: user?.device_id,
        beaconDetail: user?.beaconDetail,
        time: user?.time,
        timeStamp: user?.timeStamp,

        sensorSpeed: user?.sensorSpeed,
        sensorTime: user?.sensorTime,
        sensorDirection: user?.sensorDirection,

        xMP: user?.xMP,
        yMP: user?.yMP,

        bXMP: user?.bXMP,
        bYMP: user?.bYMP,

        xMP0: user?.xMP0,

        xMP1: user?.xMP1,
        yMP1: user?.yMP1,

        walkID: user?.walkID,
      };
      csvStream.write(formattedData);
    });

    // End the CSV stream and close the file stream
    csvStream.end();
    writeStream.on("finish", () => {
      // Set the response headers for file download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=users.csv");

      // Send the file to the client
      res.download("users.csv", "users.csv", (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          // Clean up: delete the generated file after sending
          fs.unlinkSync("users.csv");
        }
      });
    });
  } catch (error) {
    console.error("Error fetching users from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  }
};
