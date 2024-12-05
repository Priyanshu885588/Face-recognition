const express = require("express");
const router = express.Router();

const {storeFaceData,getUserFaceDescripton} = require("../controller/faceRecognition")


router.route("/storeData").post(storeFaceData)
router.route("/getData").get(getUserFaceDescripton)

module.exports = router;