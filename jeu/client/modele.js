// Modèle
// Relie les boutons de l'interface avec les écrans et crée l'objet de config de la partie

var config = {};

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
      break;
    case ecran.newgame:
      $("#btn-newgame_solo").on("click", () => {
        config.type_de_partie = "solo";
        ecran_actuel = ecran.newgame_solo;
        refresh_screen();
      });
      $("#btn-newgame_ordi").on("click", () => {
        config.type_de_partie = "ordi";
        ecran_actuel = ecran.newgame_ordi;
        refresh_screen();
      });
      $("#btn-newgame_multi").on("click", () => {
        config.type_de_partie = "multi";
        config.mode_de_jeu = "Manuel";
        ecran_actuel = ecran.newgame_multi;
        refresh_screen();
      });
      break;
    case ecran.newgame_solo:
      $("#btn-suivant").on("click", () => {
        if ($("#mode_normal").prop("checked")) {
          config.mode_de_jeu = "normal";
          ecran_actuel = ecran.file_select;
          refresh_screen();
        } else if ($("#mode_triche").prop("checked")) {
          config.mode_de_jeu = "triche";
          ecran_actuel = ecran.file_select;
          refresh_screen();
        } else {
          afficherMessage("Sélectionnez un mode de jeu", typeMessage.alert);
        }
      });
      break;
    case ecran.newgame_ordi:
      $("#btn-suivant").on("click", () => {
        if (
          ($("#mode_normal").prop("checked") ||
            $("#mode_triche").prop("checked")) &&
          ($("#diff_facile").prop("checked") ||
            $("#diff_normale").prop("checked") ||
            $("#diff_difficile").prop("checked"))
        ) {
          if ($("#mode_normal").prop("checked")) {
            config.mode_de_jeu = "normal";
          } else if ($("#mode_triche").prop("checked")) {
            config.mode_de_jeu = "triche";
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
      break;
    case ecran.file_select:
      $("#file-input").on("change", () => {
        let file = $("#file-input")[0].files[0];
        readSingleFile(file);
      });
      $("#btn-suivant").on("click", () => {
        if (config.json != undefined) {
          switch (config.type_de_partie) {
            case "solo":
              socket.emit("nouvelle partie solo", config);
              socket.on("partie créée", () => {
                console.log("yo");
                ecran_actuel = ecran.plateau;
                refresh_screen();
               });
              break;
            case "ordi":
              socket.emit("nouvelle partie ordi", config);
              socket.on("partie créée", () => {
                ecran_actuel = ecran.plateau;
                refresh_screen();
               });
              break;
            case "multi":
              socket.emit("nouvelle partie multi", config);
              ecran_actuel = ecran.waiting_room;
              refresh_screen();
              break;
          }
          /*if (config.type_de_partie == "multi") {
            ecran_actuel = ecran.waiting_room;
            socket.emit("nouvelle partie", config);
            refresh_screen();
          } else {
            socket.emit("nouvelle partie", config);
            socket.on("partie créée", (partie) => {
              ecran_actuel = ecran.plateau;
              refresh_screen();
             });
          }*/
        } else {
          afficherMessage("Un fichier de plateau est requis", typeMessage.alert);
        }
      });
      break;
    case ecran.join_game:
      $("#btn-join").on("click", () => {
        socket.emit("rejoindre partie", config, $("input").val());
        ecran_actuel = ecran.waiting_room;
        refresh_screen();
      });
      break;
    case ecran.waiting_room:
      socket.on("partie créée", (idP) => {
        $("#id").append(idP);
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
        console.log("recu");
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
      socket.on("reponse plateau", (data) => {
        afficherPlateau(data,config.codeJ);
        if (data.Tour != config.codeJ.toLowerCase()) {
          $("#btn-new_question").addClass("disabled");
          $("#btn-new_question").attr("disabled","disabled");
          $("#btn-new_devine").addClass("disabled");
          $("#btn-new_devine").attr("disabled","disabled");
          $("#btn-fin_tour").addClass("disabled");
          $("#btn-fin_tour").attr("disabled","disabled");
          $("#tour").text("C'est au tour de ton adversaire...");
        } else {
          $("#tour").text("C'est a toi !");
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
      // A SUPPR
      $("#btn-fin_tour").on("click", () => {
        // Changement du tour, on reste sur le même écran
        // On désactive les boutons au tour de l'adversaire
      });
      $("#btn-abandonner").on("click", () => {
        socket.emit("abandonner");
      });
      $("#btn-sauver_partie").on("click")
      socket.on("partie finie", (data) => {
        if (config.type_de_partie == "solo") {
          ecran_actuel = ecran.newgame;
          refresh_screen();
        } else {
          config.gagnant = data;
          ecran_actuel = ecran.winner;
          refresh_screen();
        }
      });
      break;
    case ecran.new_question:
      let attributs_plateau;
      socket.emit("requete attributs plateau", config.idPartieJoueur);
      socket.on("reponse attributs plateau", (data) => {
        $("#lignesContainer").empty();
        attributs_plateau = data;
        console.log(attributs_plateau);
        addLigneQuestion(0, attributs_plateau);
      })
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
        socket.emit("pose question", (data));
        ecran_actuel = ecran.reponse;
        refresh_screen();
      });
      break;
    case ecran.new_devine:
      $("#btn-deviner").on("click", () => {
        // Envoie et traitement de la question
        ecran_actuel = ecran.reponse;
        refresh_screen();
      });
      break;
    case ecran.reponse:
      // Afficher la réponse (vrai ou faux)
      socket.on("reponse question", (reponse) => {
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
      // Afficher le gagnant
      if(config.type_de_partie == "ordi") {
        $("#winner").text("L'ordi a gagne !");
      } else {
        $("#winner").text(config.gagnant + " a gagne !");
      }
      $("#btn-suivant").on("click", () => {
        ecran_actuel = ecran.newgame;
        refresh_screen();
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

window.onload = () => {
  setTimeout(() => {
    config.socketId = socket.id;
    ecran_actuel = ecran.pseudo;
    refresh_screen();
  }, 1000);
};
