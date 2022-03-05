// Serveur Node.js
const {attribut} = require('./classes/Attribut.js');
const {joueur} = require('./classes/Joueur.js');
const {modeDeJeu,typeDePartie,partie} = require('./classes/Partie.js');
const {personnage} = require('./classes/Personnage.js');
const {plateau} = require('./classes/Plateau.js');
const {question} = require('./classes/Question.js');
const {fbf} = require('./classes/Fbf.js');

const codeJoueur = {
  j1 : 1,
  j2 : 2 
}


/*let cheveuxRouge = new attribut("cheveux","rouge");
console.log(cheveuxRouge);
let monNum = codeJoueur.j2;
console.log(monNum)*/

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var parties = [];

function timeNow() {
  let d = new Date();
  return "[" + (d.getHours()+1).toString() + ":" + d.getMinutes() + ":" + d.getSeconds() + "]";
}

/*function trouverPartie(id){
  parties.forEach((partie) => {
    if (partie.idPartie == id){
      console.log(partie);
      return partie;
    }
  });
}*/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/public/:nomFichier", function (request, response) {
  response.sendFile("public/" + request.params.nomFichier, { root: __dirname });
});

io.on("connection", (socket) => {
  console.log(timeNow() + " " + socket.id + " s'est connecté");
  
  //NOUVELLE PARTIE CREEE EVENT
  socket.on("nouvelle partie", (config) => {
    id = NewID();
    let partie = {
      idPartie: id,
      joueurs: { J1: config },
      json: config.json
    };
    parties.push(partie);
    socket.join(partie);
    io.in(partie).emit("partie créée", partie);
  });

  //JOUEUR REJOINS UNE PARTIE EVENT
  socket.on("rejoindre partie", (config, idTape) => {
    let partie;
    parties.forEach((p) => {
      if (p.idPartie == idTape){
        partie = p;
      }
    });
    if (partie==undefined) socket.emit("erreur", "ID invalide");
    if (Object.keys(partie.joueurs).length == 1) {
      socket.join(partie);
      partie.joueurs.J2 = config;
      partie.joueurs.J1.adversaire = partie.joueurs.J2.pseudo;
      partie.joueurs.J2.adversaire = partie.joueurs.J1.pseudo;
      io.in(partie).emit("partie rejointe", partie);
    } else {
      socket.emit("erreur", "Partie pleine");
    }
  });
  
  // REQUETE PLATEAU EVENT
  socket.on("requete plateau", () => {
    socket.emit("reponse plateau", [...socket.rooms][1].json);
  });

  // REQUETE ATTR PLATEAU EVENT
  socket.on("requete attributs plateau", () => {
    socket.emit("reponse attributs plateau", attributsPlateau([...socket.rooms][1].json));
  });
  
  //QUESTION RECUE EVENT
  socket.on("pose question", (data) => {
    console.log("Question reçue : ");
    console.log(data);
    /*let valeurs = [];
    $.each(data.lignes, (numLigne, ligne) => {
      valV = true;
      if (ligne.attribut n'est pas dans le plateau de la partie)
        valV = false;
      if (ligne.non == true)
        valV = !valV;
      valeurs.push(valV);
    })*/
  });

  // ABANDON EVENT
  socket.on("abandonner", () => {
    let gagnant;
    let partie = [...socket.rooms][1]; // socket.rooms renvoie l'id et les rooms du socket actuel (objet Set)
    if(partie.joueurs.J1.socketId == socket.id) {
      gagnant = partie.joueurs.J1.adversaire;
    } else {
      gagnant = partie.joueurs.J2.adversaire;
    }
    io.in(partie).emit("partie finie", gagnant);
  });

  // LANCEMENT DE LA PARTIE EVENT
  socket.on("lancement partie", () => {
    let p = [...socket.rooms][1];
    var game = new partie(p.json['J1'],p.json['J2'],p.joueurs.J1.type_de_partie,p.joueurs.J1.mode_de_jeu,p.joueurs.J2.mode_de_jeu,0);
    let q = game.j1.getQuestionOptimal();
    let r = game.j2.plateau.poser_question(q);
    console.log("Question : " + q.fbf.toString(q.attributs) + " " + r + " " + game.j1.plateau.personnage_cache);
  });
  
  // DECONNEXION EVENT
  socket.on("disconnect", function () {
    for(p of parties) {
      if (p.joueurs.J1.socketId == socket.id || p.joueurs.J2.socketId == socket.id) {
        if (p.joueurs.J1.socketId == socket.id) {
          io.in(p).emit("partie finie", p.joueurs.J1.adversaire);
        } else {
          io.in(p).emit("partie finie", p.joueurs.J2.adversaire);
        }
        parties.splice(p,1);
      }
    };
    console.log(timeNow() + " " + socket.id + " s'est déconnecté");
  });
});

http.listen(8000, () => {
  console.log("Ecoute sur l'url : http://localhost:8000");
});

function NewID() {
  return Math.floor(Math.random() * (999999 - 100000)) + 100000;
}


function attributsPlateau(plateau){
  let res = {};
  for (const i in plateau.possibilites[0].attributs) {
    res[i] = [];
  }
  for (let personnage of plateau.possibilites) {
    for (let attr in personnage.attributs) {
      for (let val of personnage.attributs[attr]) {
        if (!res[attr].includes(val)) {
          res[attr].push(val);
        }
      }
    }
  }
  return res;
}



// Update 7/02 :
//   /!\ Attention, si le créateur de la partie met un json de
//       mauvais format ça fait planter nodejs..


// Update 14/02 :
// Ok c'est pixel, ça marche pas car le fichier du json est pas encore supporté I guess
