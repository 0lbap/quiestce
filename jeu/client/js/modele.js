// Modèle
// Relie les boutons de l'interface avec les écrans et crée l'objet de config de la partie

var config = {};

ecran_actuel = ecran.pseudo;

function refresh_screen() {
  clearEcran();
  afficherEcran(ecran_actuel);
  switch (ecran_actuel) {
    case ecran.pseudo:
      $("#btn-suivant").on("click", () => {
        if($("#pseudo").val().trim() != "") {
          config.pseudo = $("#pseudo").val().trim();
          ecran_actuel = ecran.newgame;
          refresh_screen();
        } else {
          afficherMessage("Votre pseudo est vide", typeMessage.alert);
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
        if ((($("#mode_normal").prop("checked")) || ($("#mode_triche").prop("checked"))) && (($("#diff_facile").prop("checked")) || ($("#diff_normale").prop("checked")) || ($("#diff_difficile").prop("checked")))) {
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
        let file = $('#file-input')[0].files[0];
        readSingleFile(file);
      });
      $("#btn-suivant").on("click", () => {
        if (config.plateau != undefined) {
          if (config.type_de_partie == "multi") {
            ecran_actuel = ecran.waiting_room;
          } else {
            ecran_actuel = ecran.plateau;
          }
          refresh_screen();
        } else {
          afficherMessage("Un fichier de plateau est requis", typeMessage.alert);
        }
      });
      break;
    case ecran.join_game:
      // Connection à la room ou échec
      break;
    case ecran.waiting_room:
      // Création de la room et attente
      break;
    case ecran.plateau:
      $("#btn-new_question").on("click", () => {
        ecran_actuel = ecran.new_question;
        refresh_screen();
      });
      $("#btn-new_devine").on("click", () => {
        ecran_actuel = ecran.new_devine;
        refresh_screen();
      });
      $("#btn-fin_tour").on("click", () => {
        // Changement du tour, on reste sur le même écran
        // On désactive les boutons au tour de l'adversaire
      });
      $("#btn-abandonner").on("click", () => {
        // Suppression de la room et affichage du winner
        ecran_actuel = ecran.winner;
        refresh_screen();
      });
      break;
    case ecran.new_question:
      // Gestion des questions dynamiquement
      $("#btn-poser_question").on("click", () => {
        // Envoie et traitement de la question
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
      $("#btn-suivant").on("click", () => {
        ecran_actuel = ecran.plateau;
        refresh_screen();
      });
      break;
    case ecran.winner:
      // Afficher le gagnant
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
    try{
      config.plateau = JSON.parse(contents);
      afficherMessage("Plateau chargé", typeMessage.info);
    } catch {
      afficherMessage("Impossible de charger le plateau", typeMessage.alert);
    }
  };
  reader.readAsText(file);
}

window.onload = refresh_screen;
