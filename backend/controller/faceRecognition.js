const Face = require("../modals/face");

const storeFaceData = async (req, res) => {
  const { userId, faceInfo } = req.body;
  console.log(req.body);
  if (!userId || !faceInfo) {
    return res.status(400).json({ msg: "userId and faceData is needed" });
  }
  try {
    const result = await Face.create({
      userId: userId,
      faceInfo: faceInfo,
    });

    res
      .status(201)
      .json({ msg: "Face data stored successfully!", data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserFaceDescripton = async (req,res) => {
  const {userId} = req.query;
  if(!userId){
    return res.status(400).json({ msg: "userId is needed" });
  }
  try {
    const data = await Face.find({userId:userId});
    if(data.length === 0){
      return res.status(404).json({ msg: "userId not found"})
    }
    return res.status(200).json({ msg: "Data found successfully!", data: data[0] })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { storeFaceData,getUserFaceDescripton };
