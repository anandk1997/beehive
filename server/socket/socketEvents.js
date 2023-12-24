const { disconnect } = require("mongoose");

const BeaconData = require("../models/BeaconModel.js").default;
const BeaconData1 = require("../models/BeaconModel.js").BeaconData1;
const BeaconStatus = require("../models/beaconStatus.js").BeaconStatus;

let initialWalkID;

exports.beaconDetails = function (socket, io) {
  socket.on("start", async function (data) {
    initialWalkID = await walkID();
    console.log("initialWalkID", initialWalkID);

    const current = {
      device_id: data.device_id,
      status: true,
      walk: initialWalkID,
      socketID: socket.id,
    };

    await startStatus(current);
    io.emit("reloadList", "Live event started");
    console.log("started...............", data);
  });

  socket.on("beaconDetails", function (data) {
    console.log("Received data beaconDetails:.......", data);

    insertBeacon(data);

    io.to(initialWalkID).emit("liveBeacon", data);
  });

  socket.on("stop", async function (data) {
    await falseWalkStatus(socket.id);
    io.emit("reloadList", "Live event ended");
    console.log("stopped...............", data);
  });

  socket.on("forceDisconnect", async (data) => {
    try {
      console.log("forceDisconnect");
      const beaconStatus = await BeaconStatus.findOne({ walk: data });

      const socketIdToDisconnect = beaconStatus.socketID;
      const socketToDisconnect = io.sockets.sockets.get(socketIdToDisconnect);

      if (socketToDisconnect) {
        io.to(beaconStatus.socketID).emit("forceStop", `Forcefully Stop Event`);
      } else {
        beaconStatus.status = false;
        await beaconStatus.save();
        console.log("beaconStatus", beaconStatus);
      }

      //   await new Promise((resolve) => {
      //     socketToDisconnect.once("disconnect", () => resolve());
      //     socketToDisconnect.disconnect(true);
      //   });

      //   await falseWalkStatus(socketIdToDisconnect);
      // } else {
      //   console.log("Socket not found or already disconnected");
      // }
    } catch (error) {
      console.error("Error disconnecting socket:");
    }
  });
};

const startStatus = async function (current) {
  try {
    console.log("current", current);
    const beaconStatusSchema = new BeaconStatus(current);
    await beaconStatusSchema.save();
  } catch (error) {
    console.log("startStatus", error);
  }
};

const falseWalkStatus = async function (socketID) {
  try {
    const findWalkStatus = await BeaconStatus.findOne({ socketID });
    findWalkStatus.status = false;
    findWalkStatus.save();
    return findWalkStatus;
  } catch (error) {
    console.log("error find walk status", error);
  }
};

const walkID = async function () {
  try {
    const latestWalk = await BeaconStatus.find().sort({
      walk: -1,
    });

    console.log("latestWalk", latestWalk);
    const storeWalk = latestWalk.length > 0 ? latestWalk[0].walk + 1 : 100;
    console.log("storeWalk", storeWalk);
    return storeWalk;
  } catch (error) {
    console.log("walkerror", error);
  }
};

const insertBeacon = async function (data) {
  try {
    console.log(
      initialWalkID,
      "........................initialWalkID...............",
    );
    const parsedData = JSON.parse(data);
    const modifiedData = {
      beaconDetail: parsedData?.beaconDetail,
      device_id: parsedData?.device_id?.toString(),
      time: parsedData?.time,
      timeStamp: parsedData?.timeStamp,

      sensorSpeed: parsedData?.sensorSpeed?.toString(),
      sensorTime: parsedData?.sensorTime?.toString(),
      sensorDirection: parsedData?.sensorDirection?.toString(),

      bXMP: parsedData?.bXMP?.toString(),
      bYMP: parsedData?.bYMP?.toString(),

      yMP: parsedData?.yMP?.toString(),
      xMP: parsedData?.xMP?.toString(),

      xMP0: parsedData?.xMP0,

      xMP1: parsedData?.xMP1,
      yMP1: parsedData?.yMP1,

      walkID: initialWalkID,

      beaconData: parsedData?.beaconsData,
    };

    const beaconSchema = new BeaconData1(modifiedData);
    await beaconSchema.save();
  } catch (error) {
    console.log("B Insert Error", error);
  }
};

exports.joinRoom = function (socket, io) {
  return socket.on("join_room", function (data) {
    console.log("User with ID: " + socket.id + " joined room: " + data);
    socket.join(data);
    io.to(data).emit("testingroom", "room is successfully joined");
  });
};

exports.emitRoomData = function (socket, io) {
  return socket.on("send_message", function (data) {
    io.to(data).emit("receive_message", "room " + data + " -- " + socket.id);
  });
};

exports.disconnect = async function (socket, io) {
  return socket.on("disconnect", async function () {
    try {
      console.log("A user disconnected");

      // Find the BeaconStatus document associated with the disconnected socket
      const beaconStatus = await BeaconStatus.findOne({ socketID: socket.id });

      // If the document is found, update the status to false
      if (beaconStatus) {
        beaconStatus.status = false;
        await beaconStatus.save();
        io.emit("reloadList", "Live event disconnected");
        console.log(
          "BeaconStatus document updated on disconnect:",
          beaconStatus,
        );
      } else {
        console.log(
          "No BeaconStatus document found for the disconnected socket.",
        );
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });
};
