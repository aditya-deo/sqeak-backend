require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.use(express.static(path.join(__dirname, "/public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

//Handling requests for publishing blogs
app.post("/publish", (req, res) => {
  // console.log(req.body);
  const postToAdd = new post(req.body);
  postToAdd.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("successfully added post");
    }
  });
});

// app.use(express.static(path.join(__dirname, "/public")));
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

//set static folder

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server online at port ", PORT);
});
