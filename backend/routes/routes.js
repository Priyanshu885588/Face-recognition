const express = require("express");
const router = express.Router();

const {storeFaceData} = require("../controller/faceRecognition")


router.route("/storeData").post(storeFaceData)

module.exports = router;