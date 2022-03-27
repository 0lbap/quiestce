// Modèle
// Relie les boutons de l'interface avec les écrans et crée l'objet de config de la partie

var config = {};
var tchat = [];

config.codeJ = "J1"; //par défaut, l'utilisateur est le J1

const socket = io();

function refresh_screen() {
  clearEcran();
  afficherEcran(ecran_actuel);
  switch (ecran_actuel) {
    case ecran.pseudo:
      let suivant = function () {
        let pseudo = $("#pseudo").val().trim();
        if (pseudo.length <= 20) {
          if (pseudo != "" && pseudo.match(/^[a-z0-9 _-]+$/i)) {
            config.pseudo = pseudo;
            ecran_actuel = ecran.newgame;
            $("body").unbind("keypress");
            refresh_screen();
          } else {
            afficherMessage("Votre pseudo est invalide", typeMessage.alert);
          }
        } else {
          afficherMessage("Votre pseudo est trop grand", typeMessage.alert);
        }
      };
      $("#btn-suivant").on("click", suivant);
      $("body").keypress((data) => {
        if (data.key == "Enter") {
          suivant();
        }
      });
      $("#btn-magasin").on("click", () => {
        window.open("/magasin", "_blank");
      });
      $("#btn-generateur").on("click", () => {
        window.open("/generateur", "_blank");
      });
      break;
    case ecran.newgame:
      $("#btn-newgame_solo").on("click", () => {
        config.type_de_partie = "Solo";
        ecran_actuel = ecran.newgame_solo;
        refresh_screen();
      });
      $("#btn-newgame_ordi").on("click", () => {
        config.type_de_partie = "Ordi";
        ecran_actuel = ecran.newgame_ordi;
        refresh_screen();
      });
      $("#btn-newgame_multi").on("click", () => {
        config.type_de_partie = "Multi";
        config.mode_de_jeu = "Manuel";
        ecran_actuel = ecran.newgame_multi;
        refresh_screen();
      });
      $("#btn-retour").on("click", () => {
        ecran_actuel = ecran.pseudo;
        refresh_screen();
      });
      break;
    case ecran.newgame_solo:
      $("#btn-suivant").on("click", () => {
        if ($("#mode_manuel").prop("checked")) {
          config.mode_de_jeu = "Manuel";
          ecran_actuel = ecran.file_select;
          refresh_screen();
        } else if ($("#mode_triche").prop("checked")) {
          config.mode_de_jeu = "Triche";
          ecran_actuel = ecran.file_select;
          refresh_screen();
        } else {
          afficherMessage("Sélectionnez un mode de jeu", typeMessage.alert);
        }
      });
      $("#btn-retour").on("click", () => {
        ecran_actuel = ecran.newgame;
        refresh_screen();
      });
      break;
    case ecran.newgame_ordi:
      $("#btn-suivant").on("click", () => {
        if (
          ($("#mode_manuel").prop("checked") ||
            $("#mode_triche").prop("checked")) &&
          ($("#diff_facile").prop("checked") ||
            $("#diff_normale").prop("checked") ||
            $("#diff_difficile").prop("checked"))
        ) {
          if ($("#mode_manuel").prop("checked")) {
            config.mode_de_jeu = "Manuel";
          } else if ($("#mode_triche").prop("checked")) {
            config.mode_de_jeu = "Triche";
          }
          if ($("#diff_facile").prop("checked")) {
            config.difficulte = "facile";
            ecran_actuel = ecran.file_select;
            refresh_screen();
          } else if ($("#diff_normale").prop("checked")) {
            config.difficulte = "normale";
            ecran_actuel = ecran.file_select;
            refresh_screen();
          } else if ($("#diff_difficile").prop("checked")) {
            config.difficulte = "difficile";
            ecran_actuel = ecran.file_select;
            refresh_screen();
          }
        } else {
          afficherMessage("Sélectionnez un mode de jeu et une difficulté", typeMessage.alert);
        }
      });
      $("#btn-retour").on("click", () => {
        ecran_actuel = ecran.newgame;
        refresh_screen();
      });
      break;
    case ecran.newgame_multi:
      $("#btn-join_game").on("click", () => {
        ecran_actuel = ecran.join_game;
        refresh_screen();
      });
      $("#btn-create_game").on("click", () => {
        ecran_actuel = ecran.file_select;
        refresh_screen();
      });
      $("#btn-retour").on("click", () => {
        ecran_actuel = ecran.newgame;
        refresh_screen();
      });
      break;
    case ecran.file_select:
      $("#file-input").on("change", () => {
        let file = $("#file-input")[0].files[0];
        readSingleFile(file);
      });
      $("#btn-suivant").on("click", () => {
        if (config.json != undefined) {
          switch (config.type_de_partie) {
            case "Solo":
              socket.emit("nouvelle partie solo", config);
              socket.on("partie créée", () => {
                ecran_actuel = ecran.plateau;
                refresh_screen();
               });
              break;
            case "Ordi":
              socket.emit("nouvelle partie ordi", config);
              socket.on("partie créée", () => {
                ecran_actuel = ecran.plateau;
                refresh_screen();
               });
              break;
            case "Multi":
              socket.emit("nouvelle partie multi", config);
              ecran_actuel = ecran.waiting_room;
              refresh_screen();
              break;
          }
        } else {
          afficherMessage("Un fichier de plateau est requis", typeMessage.alert);
        }
      });
      $("#btn-retour").on("click", () => {
        switch (config.type_de_partie) {
          case "Solo":
            ecran_actuel = ecran.newgame_solo;
            break;
          case "Ordi":
            ecran_actuel = ecran.newgame_ordi;
            break;
          case "Multi":
            ecran_actuel = ecran.newgame_multi;
            break;
        }
        refresh_screen();
      });
      break;
    case ecran.join_game:
        let suivant2 = function () {
          let code = $("input").val().toUpperCase();
          if(code.length == 4 && code.match(/^[a-z]+$/i)) {
            socket.emit("rejoindre partie", config, code);
            ecran_actuel = ecran.waiting_room;
            refresh_screen();
          } else {
            afficherMessage("Le code tapé n'a pas le bon format", typeMessage.alert);
          }
        };
      $("body").keypress((data) => {
        if (data.key == "Enter")
          suivant2();
      });
      $("#btn-join").on("click", suivant2);
      $("#btn-retour").on("click", () => {
        ecran_actuel = ecran.newgame_multi;
        refresh_screen();
      });
      break;
    case ecran.waiting_room:
      socket.on("partie créée", (idP) => {
        $("#id").text(idP);
      });
      socket.on("partie rejointe", (partie) => {
        $("#id").remove();
        $("h1").text("La partie peut commencer !");
        $("#btn-play").removeAttr("disabled");
        $("#btn-play").removeClass("disabled");
        if (config.json == undefined) {
          config.adversaire = partie.joueurs.J2.adversaire;
          config.codeJ = "J2";
          $("#btn-play").remove();
          $("#attente").text(
            "(2/2) \n" + config.adversaire + " sera ton adversaire"
          );
          $("#attente").append(
            "<br><br>Attend que " + config.adversaire + " lance la partie..."
          );
        } else {
          config.adversaire = partie.joueurs.J1.adversaire;
          $("#attente").text(
            "(2/2) \n" + config.adversaire + " sera ton adversaire"
          );
        }
      });
      $("#btn-play").on("click", () => {
        socket.emit("lancement partie");
      });
      socket.on("partie lancee", () =>{
        ecran_actuel = ecran.plateau;
        refresh_screen();
      })
      socket.on("erreur", (msgErreur) => {
        ecran_actuel = ecran.join_game;
        refresh_screen();
        afficherMessage(msgErreur, typeMessage.alert);
      });
      break;
    case ecran.plateau:
      socket.emit("requete plateau");
      socket.once("reponse plateau", (data) => {
        afficherPlateau(data,config.codeJ);
        if (data.Tour != config.codeJ.toLowerCase()) {
          $("#btn-new_question").addClass("disabled");
          $("#btn-new_question").attr("disabled","disabled");
          $("#btn-new_devine").addClass("disabled");
          $("#btn-new_devine").attr("disabled","disabled");
          $("#tour").text("C'est au tour de ton adversaire...");
          sendToTchat("Tour adverse.", data.Tour);
          $("#sablier").show();
        } else {
          $("#tour").text("C'est a toi !");
          sendToTchat("Votre tour.", data.Tour);
          $("#sablier").hide();
        }
      });
      $("#btn-new_question").on("click", () => {
        ecran_actuel = ecran.new_question;
        refresh_screen();
      });
      $("#btn-new_devine").on("click", () => {
        ecran_actuel = ecran.new_devine;
        refresh_screen();
      });
      $("#btn-abandonner").on("click", () => {
        socket.emit("abandonner");
      });
      $("#btn-sauver").on("click", () => {
        socket.emit("requete plateau");
        socket.once("reponse plateau", (plateau) => {
          download("Partie du " + getDate(), JSON.stringify(plateau));
        });
      });
      break;
    case ecran.new_question:
      if(config.mode_de_jeu == "Triche") {
        $("#btn-poser_question_auto").show();
        $("#btn-poser_question").text("Vérifier la question !");
      } else {
        $("#btn-poser_question_auto").hide();
      }
      let attributs_plateau;
      socket.emit("requete attributs plateau", config.codeJ.toLowerCase());
      socket.once("reponse attributs plateau", (data) => {
        $("#lignesContainer").empty();
        attributs_plateau = data;
        //console.log(attributs_plateau);
        addLigneQuestion(0, attributs_plateau);
      });
      let id = 1;
      $("#btn-nouvelle_ligne").on("click", () => {
        addLigneQuestion(id, attributs_plateau);
        id++;
      });
      $("#btn-poser_question").on("click", () => {
        let data = {
          connecteurs : [],
          lignes : []
        };
        for(let i=0; i<id; i++) {
          if ($("#conn" + i).val() != undefined) {
            data.connecteurs.push($("#conn" + i).val());
          }
          data.lignes.push({
            non: $("#not" + i).prop("checked"),
            attribut: {nom: $("#nom" + i).val(), valeur: $("#val" +i).val()}
          })
        }
        if(config.mode_de_jeu == "Triche") {
          socket.emit("evaluation", (data));
          ecran_actuel = ecran.evaluation;
          refresh_screen();
        } else {
          socket.emit("pose question", (data));
          ecran_actuel = ecran.reponse;
          refresh_screen();
        }
      });
      $("#btn-poser_question_auto").on("click", () => {
        socket.emit("Question auto");
        ecran_actuel = ecran.plateau;
        refresh_screen();
      });
      $("#btn-retour_plateau").on("click", () => {
        ecran_actuel = ecran.plateau;
        refresh_screen();
      });
      break;
    case ecran.new_devine:
      socket.emit("requete prenoms plateau", config.codeJ.toLowerCase());
      socket.once("reponse prenoms plateau", (prenoms) => {
        $("#prenoms").empty();
        addSelectVal(prenoms, "val0", "prenoms");
      });
      $("#btn-deviner").on("click", () => {
        let data = {
          connecteurs: [],
          lignes: [
            {
              non: false,
              attribut: {nom: "prenom", valeur: $("#val0").val()}
            }
          ]
        };
        console.log(data);
        socket.emit("pose question", (data));
        ecran_actuel = ecran.reponse;
        refresh_screen();
      });
      $("#btn-retour").on("click", () => {
        ecran_actuel = ecran.plateau;
        refresh_screen();
      });
      break;
    case ecran.evaluation:
      let question;
      socket.once("rep eval", (data) => {
        question = data[0];
        $("h1").text("La question est " + data[3]);
        $("p").text("Elle concerne " + data[2] + " personnages");
      });
      $("#btn-suivant").on("click", () => {
        socket.emit("pose question", (question));
        ecran_actuel = ecran.reponse;
        refresh_screen();
      });
      $("#btn-retour").on("click", () => {
        ecran_actuel = ecran.new_question;
        refresh_screen();
      });
      break;
    case ecran.reponse:
      socket.once("reponse question", (reponse) => {
        console.log(reponse);
        if(reponse == true) {
          $("h1").text("C'est vrai !");
        } else {
          $("h1").text("C'est faux !");
        }
      })
      $("#btn-suivant").on("click", () => {
        ecran_actuel = ecran.plateau;
        refresh_screen();
      });
      break;
    case ecran.winner:
      switch(config.type_de_partie){
        case "Ordi":
          if (config.gagnant == null){
            $("h1").text("L'ordi a gagne !");
            socket.emit("requete plateau");
            socket.on("reponse plateau", (data) =>{
              $("#persoATrouver").text("Vous deviez trouver " + data[config.codeJ].personnage_cache.nom + " !");
            });
          } else {
            $("h1").text(config.gagnant + " a gagne !");
          }
          break;
        case "Solo":
          $("h1").text(config.gagnant + " a gagne !");
          break;
        case "Multi":
          $("h1").text(config.gagnant + " a gagne !");
          if (config.gagnant != config.pseudo){
            socket.emit("requete plateau");
            socket.on("reponse plateau", (data) => {
              $("#persoATrouver").text("Vous deviez trouver " + data[config.codeJ].personnage_cache.nom);
            });
          }
          break;
      }
      $("#btn-suivant").on("click", () => {
        location.reload();
      });
      break;
  }
}

function readSingleFile(file) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var contents = e.target.result;
    try {
      config.json = JSON.parse(contents);
      afficherMessage("Plateau chargé", typeMessage.info);
    } catch {
      afficherMessage("Impossible de charger le plateau", typeMessage.alert);
    }
  };
  reader.readAsText(file);
}

function download(filename, text) {
  var element = document.createElement('a');
  
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename + ".json");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function getDate() {
  let d = new Date();
  let res = "";
  if(d.getDate() < 10) {
    res += "0";
  }
  res += d.getDate() + "-";
  if((d.getMonth() + 1) < 10) {
    res += "0";
  }
  res += (d.getMonth() + 1).toString() + " à ";
  if(d.getHours() < 10) {
    res += "0";
  }
  res += d.getHours() + "h";
  if(d.getMinutes() < 10) {
    res += "0";
  }
  res += d.getMinutes();
  return res;
}

function sendToTchat(msg, tour) {
  let d = new Date();
  let res = '<p class="text-' + tour + '">[';
  if(d.getHours() < 10) {
    res += "0";
  }
  res += d.getHours() + ":";
  if(d.getMinutes() < 10) {
    res += "0";
  }
  res += d.getMinutes();
  res += "] " + msg + "</p>";
  if(tchat.length > 0 && msg == "Votre tour."){
    if(tchat[tchat.length-1].split(']')[1] != " Votre tour.</p>"){
      tchat.push(res);
    }
  } else {
    tchat.push(res);
  }
  refreshTchat();
}

function refreshTchat() {
  $("#tchat").empty();
  for(let i=tchat.length-1; i>=0; i--) {
    $("#tchat").append(tchat[i]);
  }
}

window.onload = () => {
  setTimeout(() => {
    config.socketId = socket.id;
    ecran_actuel = ecran.pseudo;
    refresh_screen();
  }, 1000);
};

/* CA FAISAIT BUGGER
window.onbeforeunload = (event) => {
  if(config.type_de_partie != "solo" && config.gagnant == undefined) {
    event.returnValue = "Attention, tu es sur le point d'abandoner !"; // Ne s'affiche pas sur certains navigateurs mais c'est normal tkt
  }
};
*/

socket.on("partie finie", gagnant => {
  if(config.type_de_partie == "Solo" && gagnant == null) {
    location.reload();
  } else {
    config.gagnant = gagnant;
    ecran_actuel = ecran.winner;
    refresh_screen();
  }
});

socket.on("refresh", (joueur) => {
  console.log("refresh de " + joueur);
  if(joueur == config.codeJ.toLowerCase()) {
    refresh_screen();
  }
});

socket.on("ecrit tchat", (msg, tour) => {
  sendToTchat(msg, tour);
});
