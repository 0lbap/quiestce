const {attribut,connecteurs,fbf,codeJoueur,joueur,modeDeJeu,typeDePartie,partie,personnage,plateau,question} = require('./MAIN.js');

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var parties = [];

function timeNow() {
  let d = new Date();
  return "[" + (d.getHours()+1).toString() + ":" + d.getMinutes() + ":" + d.getSeconds() + "]";
}


// EXPRESS //
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/public/:nomFichier", function (request, response) {
  response.sendFile("public/" + request.params.nomFichier, { root: __dirname });
});

app.get("/magasin", (req, res) => {
  res.sendFile(__dirname + "/public/magasin/index.html");
});

app.get("/public/magasin/:nomFichier", function (request, response) {
  response.sendFile("public/magasin/" + request.params.nomFichier, { root: __dirname });
});

app.get("/public/magasin/json/:nomFichier", function (request, response) {
  response.sendFile("public/magasin/json/" + request.params.nomFichier, { root: __dirname });
});

app.get("/generateur", (req, res) => {
  res.sendFile(__dirname + "/public/generateur/index.html");
});

app.get("/public/generateur/:nomFichier", function (request, response) {
  response.sendFile("public/generateur/" + request.params.nomFichier, { root: __dirname });
});
// FIN EXPRESS //


// SOCKET IO //
io.on("connection", (socket) => {
  console.log(timeNow() + " " + socket.id + " s'est connecté");
  
  //NOUVELLE PARTIE SOLO CREEE EVENT
  socket.on("nouvelle partie solo", (config) => {
    let room = {
      joueurs: { J1: config },
      game: new partie(config.json['J1'],config.json['J2'],config.type_de_partie,config.mode_de_jeu,config.mode_de_jeu,0)
    };
    parties.push(room);
    socket.join(room);
    room.joueurs.J1.json.Tour = "j1";
    io.in(room).emit("partie créée");
  });

  //NOUVELLE PARTIE ORDI CREEE EVENT
  socket.on("nouvelle partie ordi", (config) => {
    let diff_ordi = 0;
    switch(config.difficulte){
      case('normale'):
        diff_ordi = 1;
        break;
      case('facile'):
        diff_ordi = 2;
        break;
      case('difficile'):
        diff_ordi = 0;
        break;
      default:
        break;
    }
    let room = {
      joueurs: { J1: config },
      game: new partie(config.json['J1'],config.json['J2'],config.type_de_partie,config.mode_de_jeu,modeDeJeu.ordi,diff_ordi)
    };
    parties.push(room);
    socket.join(room);
    let q = [...socket.rooms][1].game.j1.getQuestionOptimal();
    let r = [...socket.rooms][1].game.j2.plateau.poser_question(q);
    
    //console.log("Question : " + q.fbf.toString(q.attributs) + " " + r + " " + [...socket.rooms][1].game.j1.plateau.personnage_cache.attributs[0].valeur);
    //console.log(room.joueurs.J1.json.Tour);
    
    room.joueurs.J1.json.Tour = "j1";
    //console.log(room.joueurs.J1.json.Tour);
    io.in(room).emit("partie créée");
  });

  //NOUVELLE PARTIE MULTI CREEE EVENT
  socket.on("nouvelle partie multi", (config) => {
    id = NewID();
    let room = {
      idPartie: id,
      joueurs: { J1: config },
    };
    parties.push(room);
    socket.join(room);
    room.joueurs.J1.json.Tour = ["j1","j2"][Math.floor(Math.random() * 2)];
    io.in(room).emit("partie créée",id);
  });

  //JOUEUR REJOINS UNE PARTIE EVENT
  socket.on("rejoindre partie", (config, idTape) => {
    let partie;
    parties.forEach((p) => {
      if (p.idPartie == idTape){
        partie = p;
      }
    });
    if (partie==undefined) {
      socket.emit("erreur", "ID invalide");
    } else if (Object.keys(partie.joueurs).length == 1) {
      socket.join(partie);
      partie.joueurs.J2 = config;
      partie.joueurs.J1.adversaire = partie.joueurs.J2.pseudo;
      partie.joueurs.J2.adversaire = partie.joueurs.J1.pseudo;
      io.in(partie).emit("partie rejointe", partie);
    } else {
      socket.emit("erreur", "Partie pleine");
    }
  });

  // LANCEMENT DE LA PARTIE EVENT
  socket.on("lancement partie", () => {
    let room = [...socket.rooms][1];
    room.game = new partie(room.joueurs.J1.json['J1'],room.joueurs.J1.json['J2'],room.joueurs.J1.type_de_partie,room.joueurs.J1.mode_de_jeu,room.joueurs.J1.mode_de_jeu,0);
    //let q = room.game.j1.getQuestionOptimal();
    //let r = room.game.j2.plateau.poser_question(q);
    //console.log("Question : " + q.fbf.toString(q.attributs) + " " + r + " " + room.game.j1.plateau.personnage_cache.attributs[0].valeur);
    io.in(room).emit("partie lancee");
  });
  
  // REQUETE PLATEAU EVENT
  socket.on("requete plateau", () => {
    let room = [...socket.rooms][1];
    //console.log(room.game.save());
    //console.log(JSON.parse('{"Tour":"' + room.joueurs.J1.json.Tour + '",' + room.game.save() + '}').J1.personnages[0]);
    socket.emit("reponse plateau", JSON.parse('{"Tour":"' + room.joueurs.J1.json.Tour + '",' + room.game.save() + '}'));
  });

  // REQUETE ATTR PLATEAU EVENT
  socket.on("requete attributs plateau", () => {
    socket.emit("reponse attributs plateau", attributsPlateau([...socket.rooms][1].game));
  });

  socket.on("requete prenoms plateau", () => {
    socket.emit("reponse prenoms plateau", prenomsPlateau([...socket.rooms][1].game));
  });
  
  //QUESTION RECUE EVENT
  socket.on("pose question", (data) => {
    //console.log("Question reçue : " + data);
    let room = [...socket.rooms][1];
    let reponse = room.game[room.joueurs.J1.json.Tour].plateau.poser_question(cree_question(data));
    let msg = "Question de " + room.joueurs.J1.json.Tour + " : " + cree_question(data).fbf.toString(cree_question(data).attributs);
    io.in(room).emit("ecrit tchat", msg);
   if(data.lignes.length == 1 && data.lignes[0].attribut.nom == "prenom" && reponse == true) {
      let gagnant;
      if(room.joueurs.J1.socketId == socket.id) {
        gagnant = room.joueurs.J1.pseudo;
      } else {
        gagnant = room.joueurs.J2.pseudo;
      }
      io.in(room).emit("partie finie", gagnant);
    } else { //console.log(room.game[room.joueurs.J1.json.Tour].plateau.personnage_cache.attributs[0].valeur + " : " + reponse);
    console.log("c'était à " + room.joueurs.J1.json.Tour);
    if(room.joueurs.J1.type_de_partie != "Solo") {
      if(room.joueurs.J1.type_de_partie == "Ordi"){
        
        let question_ordi = room.game['j2'].getQuestionOptimal();
        let result = room.game.j2.plateau.poser_question(question_ordi);
        let msg = "Question de l'ordinateur :"+ question_ordi.fbf.toString(question_ordi.attributs)+" nombre de personnages restants : " +room.game.j2.plateau.compte_visible();
        socket.emit("ecrit tchat",msg);
        if(question_ordi.attributs[0].nom == 'prenom' && result){
          console.log('win ordi')
          io.in(room).emit("partie finie", 'ordi')
        }
      }else{     
      if(room.joueurs.J1.json.Tour == "j1") {
        room.joueurs.J1.json.Tour = "j2";
      } else {
        room.joueurs.J1.json.Tour = "j1";
      }
      }
    }
    console.log("c'est maintenant à " + room.joueurs.J1.json.Tour);
    io.in(room).emit("refresh", room.joueurs.J1.json.Tour);
    socket.emit("reponse question", (reponse));
    }
  });
  
  // ABANDON EVENT
  socket.on("abandonner", () => {
    let gagnant;
    let room = [...socket.rooms][1]; // socket.rooms renvoie l'id et les rooms du socket actuel (objet Set)
    if(room.joueurs.J1.type_de_partie == "Multi") {
      if(room.joueurs.J1.socketId == socket.id) {
        gagnant = room.joueurs.J1.adversaire;
      } else {
        gagnant = room.joueurs.J2.adversaire;
      }
    } else {
      gagnant = null;
    }
    io.in(room).emit("partie finie", gagnant);
  });

  // CHANGER VISIBILITE EVENT
  socket.on("changer visibilite", (data) => {
    let index = data.i;
    let codeJ= data.codeJ.toLowerCase();
    console.log("je change la visi de " + index + " pour le " + codeJ);
    let room = [...socket.rooms][1];
    //console.log(index + " : " + room.game[codeJ].plateau.personnages[index].visible);
    room.game[codeJ].plateau.toggle_visible(index);
    //console.log(index + " : " + room.game[codeJ].plateau.personnages[index].visible);
  });


  // Evaluation Question
  socket.on("evaluation", (data) => {
    // Step pour la classification des question
    let taux_error = 0.15;
    //    
    let question = cree_question(data);
    let room = [...socket.rooms][1];
    let nb_concerne = room.game[room.joueurs.J1.json.Tour].plateau.compte_personage_concerne(question);
    let bid;
    if(room.game.tdp == "Solo"){
      bid = Math.floor(room.game[room.joueurs.J1.json.Tour].plateau.compte_visible() / 2 );
    }else{
      let m;
      if(room.joueurs.J1.json.Tour == 'j1'){        
      m = room.game['j2'].plateau.compte_personage_concerne(new_question);
      }else{
      m = room.game['j1'].plateau.compte_personage_concerne(new_question);
      }
      bid = this.getBid(this.plateau.personnages,nb_concerne,m);
    }
    let cas;
    let ratio;
    if(bid > nb_concerne){
      ratio = (bid/nb_concerne)-1
    }else{
      ratio = (nb_concerne/bid)-1
    }
    if(ratio <= taux_error && ratio >= 0){
      cas = "excellente";
    }
    if(ratio <= 2*taux_error && ratio > taux_error){
      cas = "bonne";
    }
    if(ratio <= 3*taux_error && ratio > 2*taux_error){
      cas = "moyenne";
    }
    if(ratio > 3*taux_error){
      cas = "mauvaise";
    }
    if(cas === undefined ){
      cas = "error";
    }
    let reponse = [data,question.fbf.toString(question.attributs),nb_concerne,cas];
    socket.emit("rep eval", reponse);
  })

  // QUESTION AUTO EVENT
  socket.on("Question auto",() =>{
    let room = [...socket.rooms][1];
    let question = room.game[room.joueurs.J1.json.Tour].getQuestionOptimal();
    let reponse =     room.game[room.joueurs.J1.json.Tour].plateau.poser_question(question);
    let msg = "Question de " + room.joueurs.J1.json.Tour + " : " + question.fbf.toString(question.attributs);
    io.in(room).emit("ecrit tchat", msg);
       if(question.attributs.length == 1 && question.attributs[0].nom == "prenom" && reponse == true) {
        let gagnant;
        if(room.joueurs.J1.socketId == socket.id) {
          gagnant = room.joueurs.J1.pseudo;
        } else {
          gagnant = room.joueurs.J2.pseudo;
        }
        io.in(room).emit("partie finie", gagnant);
      } else { 
      console.log("c'était à " + room.joueurs.J1.json.Tour);
      if(room.joueurs.J1.type_de_partie != "Solo") {
        if(room.joueurs.J1.type_de_partie == "Ordi"){
          
          let question_ordi = room.game['j2'].getQuestionOptimal();
          let result = room.game.j2.plateau.poser_question(question_ordi);
          let msg = "Question de l'ordinateur :"+ question_ordi.fbf.toString(question_ordi.attributs)+" nombre de personnages restants : " +room.game.j2.plateau.compte_visible();
          socket.emit("ecrit tchat",msg);
          if(question_ordi.attributs[0].nom == 'prenom' && result){
            console.log('win ordi');
            io.in(room).emit("partie finie", 'ordi');
          }
        }else{     
        if(room.joueurs.J1.json.Tour == "j1") {
          room.joueurs.J1.json.Tour = "j2";
        } else {
          room.joueurs.J1.json.Tour = "j1";
        }
        }
      }
      console.log("c'est maintenant à " + room.joueurs.J1.json.Tour);
      io.in(room).emit("refresh", room.joueurs.J1.json.Tour);
      socket.emit("reponse question", (reponse));
      }
  });
  
  // DECONNEXION EVENT
  socket.on("disconnect", function () {
    console.log(timeNow() + " " + socket.id + " s'est déconnecté");
    let gagnant;
    for(p in parties) {
      if(parties[p].joueurs.J1.type_de_partie == "Multi"){
        if(parties[p].joueurs.J1.socketId == socket.id) {
          gagnant = parties[p].joueurs.J1.adversaire;
          io.in(parties[p]).emit("partie finie", gagnant);
          parties.splice(p,1);
        } else if(parties[p].joueurs.J2.socketId == socket.id) {
          gagnant = parties[p].joueurs.J2.adversaire;
          io.in(parties[p]).emit("partie finie", gagnant);
          parties.splice(p,1);
        }
      } else {
        if(parties[p].joueurs.J1.socketId == socket.id) {
          gagnant = parties[p].joueurs.J1.adversaire;
          parties.splice(p,1);
        }
      }
    }
  });
});
// FIN SOCKET IO //


http.listen(8000, () => {
  console.log("Ecoute sur l'url : http://localhost:8000");
});

function NewID() {
  return Math.floor(Math.random() * (999999 - 100000)) + 100000;
}

function attributsPlateau(game){
  let res = {};
  let atts = game.j1.getAllAttributs(game.j1.plateau.personnages)
  let attributs_nom = game.j1.plateau.attributs

  for(nom_att of attributs_nom){
    res[nom_att.nom]=[]
    for(a of atts){
      if(a.nom == nom_att.nom){
        res[a.nom].push(a.valeur);
        //console.log(a.nom);
        //console.log(a.valeur);
        // a.nom -> key -- a.valeur -> value      
      }
    }
  }
  return res;
}

function prenomsPlateau(game){
  let prenoms = [];
  for(p of game.j1.plateau.personnages){
    prenoms.push(p.attributs[0].valeur);
  }
  return prenoms;
}

function cree_question(q_json){
  connecteur = q_json['connecteurs']
  lignes = q_json['lignes']
  //console.log(q_json)
  let questions = []
  for(const l of lignes){
    let att_nom = l['attribut']['nom']
    let att_valeur = l['attribut']['valeur']
    let q_att = new attribut(att_nom,att_valeur)
    let q_fbf = new fbf(0)
    if(l['non'] == true){
      q_fbf = new fbf(q_fbf,connecteurs.not)
    }
    let q = new question(q_fbf,[q_att])
    questions.push(q)
  }
  if(questions.length > 1){

    for(let i = 0;i < questions.length;i++){
      switch(connecteur[i]){
        case('OU'):
          questions[i+1] = new question(new fbf(questions[i+1].fbf,connecteurs.or,questions[i].fbf.augmenterIndexFbf(questions[i+1].attributs.length)),questions[i+1].attributs.concat(questions[i].attributs))
          break;
        case('ET'):
          questions[i+1] = new question(new fbf(questions[i+1].fbf,connecteurs.and,questions[i].fbf.augmenterIndexFbf(questions[i+1].attributs.length)),questions[i+1].attributs.concat(questions[i].attributs))
          break;
      }
      
    }
  }
  
  return questions[questions.length-1]
}
