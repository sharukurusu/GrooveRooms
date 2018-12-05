require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var socket = require("socket.io");
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

var server = app.listen(PORT, function() {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});


var io = socket(server);

io.on("connection", function(socket){
  console.log("user connected", socket.id);

  socket.on("chat", function(data){
    io.sockets.emit("chat", data);
  })
})


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  server;
});

module.exports = app;
