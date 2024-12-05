import axios from "axios";

const url = "http://localhost:3000/api/v1";

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

export { registerface };
