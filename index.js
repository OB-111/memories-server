import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postsRoute from "./routes/posts.js";
import usersRoute from "./routes/users.js";

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/posts", postsRoute);
app.use("/users", usersRoute);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.CONNECTION_URL, {})
  .then(() =>
    app.listen(PORT, () => console.log(`Server is Runing on Port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
