const express = require("express");
const activityController = require("../controllers/ActivityController.js");

const router = express.Router();

router.route("/beaconData").get(activityController.getBeacon);
router.route("/beaconList").get(activityController.getStartStatus);
router.route("/deleteBeacon").delete(activityController.deleteBeaconStatus);
router.route("/downloadcsv").get(activityController.downloadCSV);

module.exports = router;
