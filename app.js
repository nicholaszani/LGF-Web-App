const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/reservasDB");


//MONGODB
const bookingSchema = new mongoose.Schema ({
  dia: String,
  horario: String,
  nome: String,
  equipamento: String
});

const Book = mongoose.model("Book", bookingSchema);

const equipmentSchema = new mongoose.Schema ({
  codigo: String,
  reservas: [bookingSchema]
});

const Equipment = mongoose.model("Equipment", equipmentSchema);


// GET METHOD
app.get("/", function(req, res){
  res.render("home", {titleName: "Reserva de equipamentos"});
});

app.get("/reservas", function(req, res){
  res.render("reservas", {titleName: "Reservas"});
});

app.get("/reservas/:customRouteName", function(req, res){
  const customRouteName = req.params.customRouteName;
  const titleName1 = _.capitalize(customRouteName);
  const titleName2 = titleName1.replaceAll('-', ' ');
  switch (customRouteName) {
    case "capela":
      res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: ""});
      break;
    case "centrifugas":
      res.render("equipamentos-reservados", {titleName: "Reservas centrífugas", capPageName: "Centrífugas", pageName: customRouteName, table1Name: "CE-01", table2Name: "CE-02"});
      break;
    case "fluxos":
      res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "FL-01", table2Name: "FL-02"});
      break;
    case "leitor-de-placas":
      res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: ""});
      break;
    case "qpcr":
      res.render("equipamentos-reservados", {titleName: "Reservas qPCR", capPageName: "qPCR", pageName: customRouteName, table1Name: ""});
      break;
    case "shakers":
      res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "SH-01", table2Name: "SH-02"});
      break;
    case "termocicladores":
      res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "TC-01", table2Name: "TC-02", table3Name: "TC-03"});
      break;
    default: console.log("error");

  }
});

app.get("/reservar", function(req, res){
  res.render("reservar", {titleName: "Reservar"});
});

app.get("/reservar/:customRouteName", function(req, res){
  const customRouteName = req.params.customRouteName;
  const titleName1 = _.capitalize(customRouteName);
  const titleName2 = titleName1.replaceAll('-', ' ');

  // Equipment.findOne({codigo:})

  switch (customRouteName) {
    case "qpcr":
      res.render("reservar-equipamentos", {titleName: "Reservar qPCR", pageName: "qPCR"});
      break;
    case "leitor-de-placas":
      res.render("reservar-equipamentos", {titleName: "Reservar " + titleName2, pageName: titleName2});
      break;
    case "capela":
      res.render("reservar-equipamentos", {titleName: "Reservar " + titleName1, pageName: titleName1});
    default:
      res.render("reservar-equipamentos", {titleName: "Reservar " + customRouteName, pageName: customRouteName});
  }
});



//POST METHOD
app.post("/reservar/:customRouteName", function(req, res){
  const customRouteName2 = _.lowerCase(req.params.customRouteName);
  const diaReservado = req.body.dias;
  const horarioReservado = req.body.horarios;
  const nomeReservado = req.body.nomes;
  const equipamentoReservado = req.body.equipamentos;

  const booked = new Book ({
    dia: diaReservado,
    horario: horarioReservado,
    nome: nomeReservado,
    equipamento: equipamentoReservado
  });

  Equipment.findOne({codigo: equipamentoReservado}, function(err, foundEquipment){
    if (err) {
      console.log(err);
    } else {
      foundEquipment.reservas.push(booked);
      foundEquipment.save();
      res.redirect("/reservar" + customRouteName2);
    }
  });
});



//CONNECTION
app.listen(3000, function(){
  console.log("Server is up and running on port 3000");
});
