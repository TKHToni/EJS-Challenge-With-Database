//jshint esversion:6

//Requirements

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//Calling and using requirements

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost/ejsChallengeDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Initial variables

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Mongoose Schemas

const userInputs = new mongoose.Schema({
  inputTitle: String,
  inputTitleKebab: String,
  inputText: String
});

const postTitles = new mongoose.Schema({
  givenTitle: String
});

//Mongoose collections

const Input = mongoose.model("Input", userInputs);

const Title = mongoose.model("Title", postTitles);


// let userInputs = [];
// let postTitles = [];

// Home route

app.get("/", function(req, res){

  Input.find({}, function(err, results){

    if (results.length === 0) {
      const firstInput = [{inputTitle: "", inputText: ""}];
      res.render("home", {firstParagraph: homeStartingContent, userInputs: firstInput});
    } else {
      res.render("home", {firstParagraph: homeStartingContent, userInputs: results});
    }

  });




});

//Contact route

app.get("/contact", function(req, res){
  res.render("contact", {contactParagraph: contactContent});
});

//About route

app.get("/about", function(req, res){
  res.render("about", {aboutParagraph: aboutContent});
});

//Compose route and post

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Input({
    inputTitle: _.startCase(req.body.userTitle),
    inputTitleKebab: _.kebabCase(req.body.userTitle),
    inputText: req.body.userText
  });

  post.save(function(err){

    if (!err) {
      res.redirect("/")
    }
  });

});

//user parameter input in the url box

app.get("/posts/:parameterInput", function(req, res){
  Input.exists({inputTitleKebab: _.kebabCase(req.params.parameterInput)}).then(result => {
    if (result === true) {

      let postTitle = _.startCase(_.capitalize(req.params.parameterInput));

      Input.find({inputTitleKebab: _.kebabCase(req.params.parameterInput)}, function(err, results){

        results.forEach(function(element){
          const targetParameter = element.inputText;
          res.render("post", {postTitle: postTitle, postText: targetParameter});
        });

      });
    }
    else {
      let postTitle = "Post not found...";
      let postText = "";
      res.render("post", {postTitle: postTitle, postText: postText});
    };
  });


});











app.listen(3000, function() {
  console.log("Server started on port 3000");
});
