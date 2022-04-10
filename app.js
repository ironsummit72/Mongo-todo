const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

const app = express();
const port = 8080;
var items = [];
var item = "";

//  connection with the database
mongoose.connect("mongodb://localhost:27017/mongo-do");
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// get route

app.get("/", function (req, res) {
  //reciving data from database

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mongo-do");
    dbo
      .collection("list")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;

        for (var i = 0; i < result.length; i++) {
          console.log(result[i].todo);
          item = result[i].todo;
          items[i] = item;
        }

        db.close();
      });
  });

  res.render("index", { ListItems: items });
});
app.post("/", function (req, res) {
  console.log("your todo is : ", req.body.todos);
  // items.push(req.body.todos);
  let schema = { todo: req.body.todos };
  db.collection("list").insertOne(schema, function (err, collection) {
    if (err) throw err;
    console.log("record insert successfully");
  });

  res.redirect("/");
  req.send("added");

  //res.redirect('/')
});

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
