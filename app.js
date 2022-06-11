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
      res.render("equipamentos-reservados", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: ""});
      break;
    case "centrifugas":
      res.render("equipamentos-reservados", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "CE-01", table2Name: "CE-02"});
      break;
    case "fluxo":
      res.render("equipamentos-reservados", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "FL-01", table2Name: "FL-02"});
      break;
    case "leitor-de-placas":
      res.render("equipamentos-reservados", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: ""});
      break;
    case "qpcr":
      res.render("equipamentos-reservados", {titleName: "Reservar qPCR", capPageName: "qPCR", pageName: customRouteName, table1Name: ""});
      break;
    case "shakers":
      res.render("equipamentos-reservados", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "SH-01", table2Name: "SH-02"});
      break;
    case "termocicladores":
      res.render("equipamentos-reservados", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "TC-01", table2Name: "TC-02", table3Name: "TC-03"});
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
  switch (customRouteName) {
    case "capela":
      res.render("reservar-equipamentos", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: ""});
      break;
    case "centrifugas":
      res.render("reservar-equipamentos", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "CE-01", table2Name: "CE-02"});
      break;
    case "fluxo":
      res.render("reservar-equipamentos", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "FL-01", table2Name: "FL-02"});
      break;
    case "leitor-de-placas":
      res.render("reservar-equipamentos", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: ""});
      break;
    case "qpcr":
      res.render("reservar-equipamentos", {titleName: "Reservar qPCR", capPageName: "qPCR", pageName: customRouteName, table1Name: ""});
      break;
    case "shakers":
      res.render("reservar-equipamentos", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "SH-01", table2Name: "SH-02"});
      break;
    case "termocicladores":
      res.render("reservar-equipamentos", {titleName: "Reservar " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "TC-01", table2Name: "TC-02", table3Name: "TC-03"});
      break;
    default: console.log("error");

  }
});



//POST METHOD
app.post("/reservar/:customRouteName", function(req, res){
  const customRouteName2 = _.lowerCase(req.params.customRouteName);
  const diaReservado = req.body.dias;
  const horarioReservado = req.body.horarios;
  const nomeReservado = req.body.nomes;
  const equipamentoReservado = req.body.equipamentos;

  const booked = new Book {
    dia: diaReservado,
    horario: horarioReservado,
    nome: nomeReservado,
    equipamento: equipamentoReservado
  }

  switch (customRouteName) {
    case "capela":
      
      break;
    case "centrifugas":

      break;
    case "fluxo":

      break;
    case "leitor de placas":

      break;
    case "qpcr":

      break;
    case "shakers":

      break;
    case "termocicladores":

      break;
    default: console.log("error");
  }
});



//CONNECTION
app.listen(3000, function(){
  console.log("Server is up and running on port 3000");
});
