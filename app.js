require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const https = require("https");
const _ = require("lodash");
const app = express();

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require ("passport-local-mongoose");

//IMPLEMENTING GOOGLE OAUTH2.0
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");  //So that "mongoose" findOrCreate function can work

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
mongoose.connect(process.env.MONGODB_CONNECTION);


//SETTING UP SESSION, PASSPORT, LOCAL STRATEGY

app.use(session({
  secret: "I love Jaque.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  familyName: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//IMPLEMENTIG GOOGLE OAUTH2.0
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,  //Getting client ID saved in .env file
  clientSecret: process.env.CLIENT_SECRET,  //Getting client secret saved in .env file
  callbackURL: "https://www.lgfwebapp.ib.unicamp.br/auth/google/home",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"   //This key has to be added manually (not included in the boilerplate)
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id, name: profile.name.givenName, familyName: profile.name.familyName }, function (err, user) {
    return cb(err, user);
    
  });
  
}
));



//MONGODB
const bookingSchema = new mongoose.Schema ({
  dia: String,
  horario: String,
  nome: String,
  equipamento: String,
});

const Book = mongoose.model("Book", bookingSchema);

const equipmentSchema = new mongoose.Schema ({
  codigo: String,
  reservas: [bookingSchema]
});

const Equipment = mongoose.model("Equipment", equipmentSchema);

const pedidoSchema = new mongoose.Schema ({
  pedido: String,
  autor: String,
  data: String,
  status: String,
  update: String,
  observation: String
});

const Pedido = mongoose.model("Pedido", pedidoSchema);


// GET METHOD
app.get("/", function(req, res){
  if (req.isAuthenticated()){
    res.render("home2", {titleName: "LGF Web App", isLoggedIn: true});
  } else {
    res.render("home", {titleName: "LGF Web App", isLoggedIn: false});
  }
});

app.get("/reservas", function(req, res){
  if (req.isAuthenticated()){
    res.render("reservas", {titleName: "Reservas", isLoggedIn: true});
  } else {
    res.render("reservas", {titleName: "Reservas", isLoggedIn: false});
  }
});

app.get("/reservas/:customRouteName", function(req, res){
  if (req.isAuthenticated()){
    const customRouteName = req.params.customRouteName;
    const titleName1 = _.capitalize(customRouteName);
    const titleName2 = titleName1.replaceAll('-', ' ');
    switch (customRouteName) {
      case "capela":
        res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "Capela", isLoggedIn: true});
        break;
      case "centrifugas":
        res.render("equipamentos-reservados", {titleName: "Reservas centrífugas", capPageName: "Centrífugas", pageName: customRouteName, table1Name: "CE-01", table2Name: "CE-02", isLoggedIn: true});
        break;
      case "fluxos":
        res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "FL-01", table2Name: "FL-03", isLoggedIn: true});
        break;
      case "leitor-de-placas":
        res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "leitor-de-placas", isLoggedIn: true});
        break;
      case "qpcr":
        res.render("equipamentos-reservados", {titleName: "Reservas qPCR", capPageName: "qPCR", pageName: customRouteName, table1Name: "qPCR", isLoggedIn: true});
        break;
      case "shakers":
        res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "SH-01", table2Name: "SH-02", isLoggedIn: true});
        break;
      case "termocicladores":
        res.render("equipamentos-reservados", {titleName: "Reservas " + titleName2, capPageName: titleName2, pageName: customRouteName, table1Name: "TC-01", table2Name: "TC-02", table3Name: "TC-03", isLoggedIn: true});
        break;
      default: console.log("error");
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/reservar", function(req, res){
  if (req.isAuthenticated()){
    res.render("reservar", {titleName: "Reservar", isLoggedIn: true});
  } else {
    res.render("reservar", {titleName: "Reservar", isLoggedIn: false});
  }
});

app.get("/reservar/:customRouteName", function(req, res){
  if (req.isAuthenticated()){
    const customRouteName = req.params.customRouteName;
    const titleName1 = _.capitalize(customRouteName);
    const titleName2 = titleName1.replaceAll('-', ' ');

    if (customRouteName === "leitor-de-placas") {
      res.render("reservar-equipamentos", {titleName: "Reservar " + titleName2, pageName: titleName2, routeName: customRouteName, isLoggedIn: true});
    } else {
      res.render("reservar-equipamentos", {titleName: "Reservar " + customRouteName, pageName: customRouteName, routeName: customRouteName, isLoggedIn: true});
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/json/:customRouteName", function(req, res){
  if (req.isAuthenticated()){
    const customRouteName = req.params.customRouteName;
    Equipment.findOne({codigo: customRouteName}, 'reservas', (err, foundEquipments) => {
      if(err){
        console.log(err);
      } else {
        res.send(foundEquipments);
      }
    });
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/about", function(req, res){
  if (req.isAuthenticated()){
    res.render("about", {titleName: "Sobre", isLoggedIn: true});
  } else {
    res.render("about", {titleName: "Sobre", isLoggedIn: false});
  }
});

app.get("/planilhas", function(req, res){
  if (req.isAuthenticated()){
    res.render("planilhas", {titleName: "Planilhas", isLoggedIn: true});
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/pedidos", function(req, res){
  if (req.isAuthenticated()){
    Pedido.find({}, (err, pedidos) => {
      if (err) {
        console.log(err);
      } else {
        res.render("pedidos", {titleName: "Pedidos", pedidosArray: pedidos, isLoggedIn: true});
      }
    });
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/pedidos/admin", (req, res) => {
  if (req.isAuthenticated()){
    var name = req.user.name;
    var familyName = req.user.familyName;
    var userName = (name + familyName).toLowerCase();
    if (userName === "pedroaraújo" || userName === "nicholaszani"){
      Pedido.find({}, (err, pedidos) => {
        if (err) {
          console.log(err);
        } else {
          res.render("pedidos-adm", {titleName: "Admin", pedidosArray: pedidos, isLoggedIn: true});
        }
      });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get("/pedidos/admin/:customRouteName", function(req, res){
  if (req.isAuthenticated()){
    var name = req.user.name;
    var familyName = req.user.familyName;
    var userName = (name + familyName).toLowerCase();
    if (userName === "pedroaraújo" || userName === "nicholaszani"){
      const id = req.params.customRouteName;
      Pedido.findById(id, function(err, pedido){
        if (err) {
          console.log(err);
        } else {
          res.render("pedidos-edit", {titleName: "Editar pedido", pedidoObject: pedido, isLoggedIn: true});
        }
      });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/home",
  passport.authenticate("google", { failureRedirect: "/" }),     //REDIRECTING TO THE SELECTED ROUTE ONCE GOOGLE AUTHENTICATION IS COMPLETED
  function(req, res) {
    // Successful authentication, redirect to secrets route (where authentication will be checked).
    res.redirect("/");
  });



//POST METHOD
app.post("/reservar/:customRouteName", function(req, res){
  const customRouteName = req.params.customRouteName;
  const diaReservado = req.body.dias;
  const horarioReservado = req.body.horarios;
  const familyName = req.user.familyName.slice(0, 1);
  const name = req.user.name;
  const autor = name + " " + familyName + ".";

  const booked = new Book ({
    dia: diaReservado,
    horario: horarioReservado,
    nome: autor,
    equipamento: customRouteName
  });

  Equipment.findOne({codigo: customRouteName}, function(err, foundEquipment){
    if (err) {
      console.log(err);
    } else {
      if (foundEquipment === null){
        const equipment = new Equipment({
          codigo: customRouteName,
          reservas: [booked]
        });
        equipment.save();
        res.redirect("/reservar/" + customRouteName);
      } else {
        if (foundEquipment.codigo === customRouteName) {
          foundEquipment.reservas.push(booked);
          foundEquipment.save();
          res.redirect("/reservar/" + customRouteName);
        }
      }
    }
  });
});

app.post("/delete/:customRouteName", (req, res) => {
  const customRouteName = req.params.customRouteName;

  if (customRouteName === "reserva") {
    const equipamentoReserva = req.body.equipamento;
    const idReserva = req.body.idReserva;

    Equipment.findOneAndUpdate({codigo: equipamentoReserva}, {$pull: {reservas: {_id: idReserva}}}, function(err, result){
      if(err){
        console.log(err);
      } else {
        res.redirect("/reservar/" + equipamentoReserva);
      }
    })
  }

  if (customRouteName === "pedido") {
    const idPedido = req.body.id;
    Pedido.deleteOne({id:idPedido}).then(function(){
        res.redirect("/pedidos");
      }).catch(function(error){
        console.log(error);
      });
  }
  
  
});

app.post("/pedidos", (req, res) =>{
  const titleName = req.body.routename;
  const familyName = req.user.familyName.slice(0, 1);
  const name = req.user.name;
  const autor = name + " " + familyName + ".";
  const pedidoRecebido = req.body.pedidoInput;
  const dataPedido = req.body.dateInput;

  const pedidoFeito = new Pedido ({
    pedido: pedidoRecebido,
    autor: autor,
    data: dataPedido,
    status: "Aguardando compra",
    update: dataPedido,
    observation: ""
  })

  pedidoFeito.save();
  if(titleName === "Admin"){
    res.redirect("/pedidos/admin");
  } else {
    res.redirect("/pedidos");
  }
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/pedidos/admin');
});

app.post("/pedidos/admin/update", (req, res) => {
  const status = req.body.status;
  const data = req.body.dateInput;
  const observation = req.body.observation;
  const id = req.body.id;
  Pedido.findOneAndUpdate({_id: id}, {status: status, update: data, observation: observation}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.redirect("/pedidos/admin");
    }
  });
});


//CONNECTION
let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function(){
  console.log("Server has started successfully");
});
