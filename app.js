const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Capture every moment, big or small, in your virtual diary. Jot down your achievements, aspirations, challenges, and cherished memories. From capturing your travel adventures to expressing your deepest emotions, our platform is here to be your trusted companion.";
const aboutContent="e believe in the power of journaling as a therapeutic practice, enabling self-reflection, stress reduction, and personal development. That's why we offer writing prompts and guided exercises to inspire you on your journaling journey. You can also choose to keep your diary private or share specific entries with a trusted friend or family member, fostering a sense of connection and community.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB", { useNewUrlParser: true });
mongoose.set('strictQuery', true);

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    if (err) {
      console.log(err);
      // Handle the error as desired, such as rendering an error page
      res.render("error", { error: "An error occurred." });
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    }
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (err) {
      console.log(err);
      // Handle the error as desired, such as rendering an error page
      res.render("error", { error: "An error occurred." });
    } else {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function(err, post) {
    if (err) {
      console.log(err);
      // Handle the error as desired, such as rendering an error page
      res.render("error", { error: "An error occurred." });
    } else {
      if (post) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      } else {
        // Handle the case when no post is found
        res.render("error", { error: "Post not found." });
      }
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
