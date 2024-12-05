require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./db/db");

const faceRoute = require("./routes/routes")


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1",faceRoute)



app.get("/start", (req, res) => {
  console.log("Starting the process...");
  res.send("Process completed successfully!");
});


const port = process.env.PORT || 3000; // Use environment variable or default port 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log("server is listening on ", port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
