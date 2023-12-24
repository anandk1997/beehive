const mongoose = require("mongoose");

const beaconStatusSchema = new mongoose.Schema(
  {
    device_id: String,
    status: Boolean,
    walk: Number,
    socketID: String,
  },
  {
    timestamps: true,
  },
);

module.exports.BeaconStatus = mongoose.model(
  "BeaconStatus",
  beaconStatusSchema,
);
