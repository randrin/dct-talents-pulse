import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/index.js";
import morgan from "morgan";
import cloudinary from "cloudinary";
import userRouters from "./routers/userRouters.js";
import candidateRouters from "./routers/candidateRouters.js";
import expertiseRouters from "./routers/expertiseRouters.js";
import sectorRouters from "./routers/sectorRouters.js";
import dctRouters from "./routers/dctRouters.js";
import uploadRouters from "./routers/uploadRouters.js";
import activityRouters from "./routers/activityRouters.js";

const app = express();

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

/* Headers */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request =
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// MONGODB CONNECTION
mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((error) => {
    console.log("Error connected to mongodb:", error.reason);
  });

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(express.json()); // Equivalent to bodyParser, to have data in req.body
app.use(cookieParser());
// app.use(upload());
app.use(cors());
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Routes Middleware
// fs.readdirSync("./routers").map((r) =>
//   app.use(config.API_ROOT, require(`./routers/${r}`))
// );
app.use(config.API_ROOT, userRouters);
app.use(config.API_ROOT, candidateRouters);
app.use(config.API_ROOT, expertiseRouters);
app.use(config.API_ROOT, sectorRouters);
app.use(config.API_ROOT, dctRouters);
app.use(config.API_ROOT, uploadRouters);
app.use(config.API_ROOT, activityRouters);

// Server Port
app.listen(config.PORT, () => {
  console.log(`Server started at http://localhost:${config.PORT}`);
});
