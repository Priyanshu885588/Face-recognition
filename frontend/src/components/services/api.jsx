import axios from "axios";

const url = "https://face-recognition-n5j6.vercel.app/api/v1";

const registerface = async (data) => {
  try {
    console.log(data.faceInfo);
    const response = await axios.post(`${url}/storeData`, data);
    return response.data;
  } catch (error) {
    console.error("Error registering student data:", error);
    throw error;
  }
};

const getfacedata = async (userid) => {
  try {
    console.log(userid);
    const response = await axios.get(`${url}/getData?userId=${userid}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching face data:", error);
    throw error;
  }
};

export { registerface, getfacedata };
