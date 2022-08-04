var express = require("express");
var path = require("path");

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectId;

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));
app.get("/user", (req, res) => {
  let users = [];
  db.collection("Form")
    .find()
    .forEach((text) =>users.push(text))
    .then(() => {
      res.status(200).json(users);
      // res.status(200).json(texts[0].name);
      //    res.render("index",  texts )
    })
    .catch(() => {
      res.status(500).json({ error: "could not fetch users" });
    });
});
app.post("/success", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var tel = req.body.tel;
  var password=req.body.password;
  var data = {
    name: name,
    email: email,
    tel: tel,
    password:password
  };

  db.collection("Form").insertOne(data, (err) => {
    if (err) {
      throw err;
    }
    console.log("Record Inserted Successfully");
  });
  return res.redirect("index.html");
});
app.delete("/delete/:id", function (req, res) {

  let deleteId = req.params.id;

  console.log( deleteId);

  db.collection("Form").deleteOne({_id:ObjectID(deleteId)}, function (err) {

    if (err) console.log(err);

    console.log("Successful deletion");

    res.end();

  });
 // res.sendFile(path.join(__dirname, "public", "/index.html"));


});


app.get("/find/:id", function (req, res) {

  let Id = req.params.id;

  console.log( Id);

  db.collection("Form").findOne({_id:ObjectID(Id)}, function (err,data) {

    if (err) console.log(err);

    console.log("Successful find");
    res.send(data);

    res.end();

  });
  return res.redirect("index.html");

});
app.post("/update/:id", function (req, res) {

  let Id = req.params.id;

  console.log( Id);

  db.collection("Form").updateOne({_id:ObjectID(Id)},{
    $set:{
      name:req.body.name,
      email:req.body.email,
      tel:req.body.tel,
      password:req.body.password
    }
  }, );
    res.sendFile(path.join(__dirname, "public", "index.html"));
    //return res.redirect("index.html");

  
  });

app.get("/", (req, res) => {
    return res.redirect("index.html");
  })
  .listen(4000);

console.log("Listening on PORT 4000");
