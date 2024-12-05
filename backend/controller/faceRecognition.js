const Face = require("../modals/face")

const storeFaceData = async (req,res) =>{
    const { userId, faceInfo } = req.body;
    if(!userId || !faceInfo){
        return res.status(400).json({ msg: "userId and faceData is needed" });
    }
    try {
        const result = await Face.create({
            userId: userId,
            faceInfo: faceInfo,
        });

        res.status(201).json({ msg: "Face data stored successfully!", data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {storeFaceData}