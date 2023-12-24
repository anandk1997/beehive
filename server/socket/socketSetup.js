const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const socketEvents = require("./socketEvents.js");

exports.setupSocket = function () {
  const app = express();
  const server = http.createServer(app);

  const io = new socketIO.Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", function (socket) {
    console.log("A user connected", socket.id);

    socketEvents.beaconDetails(socket, io);
    socketEvents.joinRoom(socket, io);
    socketEvents.emitRoomData(socket, io);

    socketEvents.disconnect(socket, io);
  });

  const SOCKETPORT = process.env.SOCKETPORT || 3328;

  server.listen(SOCKETPORT, function () {
    console.log("Socket Server is running on port" + SOCKETPORT);
  });
};
