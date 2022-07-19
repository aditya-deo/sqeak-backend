require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

var mongoDB = process.env.MONGODBCONNECTION;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.log(err);
    else console.log("MongoDB connected");
  }
);

// var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

var postSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    author: String,
    desc: String,
    content: String,
  },
  { collection: "Posts" }
);
const post = mongoose.model("Post", postSchema);

//Handling request for PostCards (send all the posts for now)
app.get("/cards", (req, res) => {
  post.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

//Handling request for /read/postID
app.get("/read", (req, res) => {
  const Postid = req.query["id"];
  post.findOne({ id: Postid }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server online at port ", PORT);
});