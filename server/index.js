const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");

const activityRoutes = require("./routes/ActivityRoutes.js");
const db = require("./db/index.js");
const socketSetup = require("./socket/socketSetup.js");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);
app.use(express.json());

const server = http.createServer(app);

db.dbConnect();
socketSetup.setupSocket();

app.use("/api/v1", activityRoutes);

const PORT = process.env.PORT || 3327;
server.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
