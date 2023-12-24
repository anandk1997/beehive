const mongoose = require("mongoose");

const beaconDataSchema = new mongoose.Schema({
  id: Number,
  UUID: String,
  macAddress: String,
  time: String,
  rssi: Number,
  k_rssi: Number,
  avg_rssi: Number,
  distance: Number,
  distance1: Number,
  baseDistance: Number,
  major: Number,
  minor: Number,
  xPoint: Number,
  yPoint: Number,
  xMP: Number,
  yMP: Number,
  xMP0: Number,
  xMP1: Number,
  yMP1: Number,
  height: Number,
  txPower: Number,
  batteryLevel: Number,
  batteryVoltage: Number,
  currentNow: Number,
  currentAvg: Number,
  chargeCounter: Number,
  energyCounter: Number,
  beaconBatteryLevel: Number,
  accelerometerValue: Number,
  date: String,
  timeStamp: Number,

  // {
  //   device_id: String,
  //   beaconDetail: String,
  //   time: String,
  //   timeStamp: Number,

  //   xMP: Number,
  //   yMP: Number,

  //   xMP0: String,

  //   xMP1: String,
  //   yMP1: String,
  //   // yMP0: String,
});

const beaconDataSchema1 = new mongoose.Schema(
  {
    device_id: String,
    beaconDetail: String,
    time: String,
    timeStamp: Number,

    xMP: String,
    yMP: String,

    xMP0: String,

    xMP1: String,
    yMP1: String,
    beaconData: String,

    sensorSpeed: String,
    sensorTime: String,
    sensorDirection: String,

    bXMP: String,
    bYMP: String,

    walkID: Number,
  },
  {
    timestamps: true,
  },
);

const BeaconData = mongoose.model("BeaconData", beaconDataSchema);
module.exports.BeaconData1 = mongoose.model("BeaconD", beaconDataSchema1);

module.exports.default = BeaconData;
