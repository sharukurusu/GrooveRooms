// Requiring path to so we can use relative routes to our HTML files
var db = require("../models");

var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    // console.log(req.user)
    if (req.user) {
      res.redirect("/members");
    }
    // res.sendFile(path.join(__dirname, "../public/signup.html"));
    res.render("signup");
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    // res.sendFile(path.join(__dirname, "../public/login.html"));
    res.render("login");
  });

  app.get("/chat", isAuthenticated, function(req, res) {
    // res.sendFile(path.join(__dirname, "../public/chat.html"));
    res.render("chat");
  });

  app.get("/edit", isAuthenticated, function(req, res) {
    
    res.render("edit");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.render("profile", {owner: true, user: req.user})
    // res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  app.get("/members/:username", isAuthenticated, function(req, res) {
    db.User.findOne({where: { username: req.params.username } })
    .then(function(data) {
        if (data.username === req.user.username) {
            res.render("profile", {owner: true, user: req.user})
        } else {
            res.render("profile", {owner: false, user: data});
        }
    })
    
    
  });

//   app.get("*", function(req, res) {
//     res.render("404");
//   });
};
