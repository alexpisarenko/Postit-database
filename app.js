const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/postitDB");

const postitSchema = new mongoose.Schema({
  name: String,
  message: String,
});

const Post = mongoose.model("Post", postitSchema);

app.post("/", (req, res) => {
  const postName = req.body.postName;
  const postMessage = req.body.postMessage;

  const post = new Post({ name: postName, message: postMessage });

  post.save((err, doc) => {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

app.get("/all", (req, res) => {
  //debug JSON
  Post.find((err, foundPosts) => {
    if (!err) {
      res.send(foundPosts);
    } else {
      res.send(err);
    }
  });
});

app.get("/:post_id", (req, res) => {
  const postId = req.params.post_id;

  console.log(postId);

  Post.findById(postId, (err, post) => {
    if (!err) {
      res.send(post);
    } else {
      console.log(err);
      res.send({ err: true });
    }
  });
});

app.get("/", (req, res) => {
  Post.find((err, foundPosts) => {
    if (!err) {
      res.render("posts", { posts: foundPosts });
    } else {
      res.send(err);
    }
  });
});

//Delete route
app.post("/delete/:post_id", (req, res) => {
  const post_id = req.params.post_id;
  Post.findByIdAndDelete(post_id, (err, doc) => {
    if (!err) {
      console.log(`Deleted post: ${post_id}`);
      res.redirect("/");
    } else {
      console.log(err);
      res.send({ err: true });
    }
  });
});

//Update route
app.post("/:post_id", (req, res) => {
  const post_id = req.params.post_id;

  Post.findById(post_id, (err, post) => {
    if (!err) {
      console.log(post);
      post.message = req.body.postMessage;

      post.save((err, doc) => {
        if (!err) {
          res.redirect("/");
        } else {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      console.log(err);
      res.send({ err: true });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
