const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/reservasDB");


// GET METHOD
app.get("/", function(req, res){
  res.render("home", {pageName: "Reserva de equipamentos"});
});

app.get("/reservas", function(req, res){
  res.render("reservas", {pageName: "Reservas"});
});

app.get("/reservas/:customRouteName1", function(req, res){
  const customRouteName1 = _.capitalize(req.params.customRouteName1);
  res.render("reservaequipamentos", {pageName: "Reservas " + customRouteName1.replaceAll('-', ' '), tableName: customRouteName1.replaceAll('-', ' ')});
});

app.get("/reservar", function(req, res){
  res.render("reservar", {pageName: "Reservar"});
});

app.get("/reservar/:customRouteName2", function(req, res){
  const customRouteName2 = _.capitalize(req.params.customRouteName2);
  res.render("reservaequipamentos", {pageName: "Reservar " + customRouteName2.replaceAll('-', ' '), tableName: customRouteName2.replaceAll('-', ' ')});
});



app.listen(3000, function(){
  console.log("Server is up and running on port 3000");
});
