const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const { DB_HOST, DB_PORT, DB_NAME } = process.env;
// mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

//online db connection
mongoose.connect(
  "mongodb://mongo:kc4oMsGVj7MSbGewohmX@containers-us-west-185.railway.app:6121"
);

app.use(cors());
app.use(express.json());
app.use("/users", require("./api/users"));
app.use("/posts", require("./api/posts"));
app.use("/likes", require("./api/likes"));
app.use("/reviews", require("./api/reviews"));

app.listen(8899, () => console.log("Server running on port : 8899"));
mongoose.connection.once("open", () => console.log("Connecting to MongoDB..."));
