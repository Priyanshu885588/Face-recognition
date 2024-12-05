const mongoose = require("mongoose");

const FaceInfoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  faceInfo: {
    type: [Number], 
    required: true,
  },
});

module.exports = mongoose.model("FaceInfo", FaceInfoSchema);
