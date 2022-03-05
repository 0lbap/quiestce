// Vue
// Contient des méthodes pour l'affichage d'éléments

const ecran = {
  pseudo: "pseudo",
  newgame: "newgame",
  newgame_solo: "newgame_solo",
  newgame_ordi: "newgame_ordi",
  newgame_multi: "newgame_multi",
  file_select: "file_select",
  join_game: "join_game",
  waiting_room: "waiting_room",
  plateau: "plateau",
  new_question: "new_question",
  new_devine: "new_devine",
  evaluation: "evaluation",
  reponse: "reponse",
  winner: "winner",
};

const typeMessage = {
  info: "info",
  alert: "alert",
  warning: "warning",
};

const connecteurLogique = {
  NON: "NON",
  ET: "ET",
  OU: "OU",
};

var ecran_actuel;

function afficherEcran(nomEcran) {
  clearEcran();
  console.log("Écran " + nomEcran + " affiché");
  let html = "";
  switch (nomEcran) {
    case ecran.pseudo:
      html += "<h1>Entrez votre pseudo :</h1>";
      html += '<input type="text" id="pseudo" placeholder="mon_pseudo_cool" maxlength="20">';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-suivant">OK</button>';
      html += '<br><br>';
      html += '<a href="/magasin" target="_blank">Magasin de plateaux</a>';
      html += '<br>';
      html += '<a href="/generateur" target="_blank" class="text-gray">Générateur de plateaux (fonctionnel mais WIP)</a>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.newgame:
      html += "<h1>Nouvelle partie</h1>";
      html += '<button id="btn-newgame_solo">Solo</button>';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-newgame_ordi">Contre l\'ordi <span class="text-red">(WIP)</span></button>';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-newgame_multi">Multijoueur <span class="text-red">(WIP)</span></button>';
      html += '<br><br>';
      html += '<button id="btn-retour">↩ Retour</button>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.newgame_solo:
      html += "<h1>Nouvelle partie</h1>";
      html += "<p>Mode :</p>";
      html +=
        '<input type="radio" name="mode" id="mode_manuel" value="Normal">';
      html += '<label for="mode_manuel">Manuel</label>';
      html += "<br>";
      html +=
        '<input type="radio" name="mode" id="mode_triche" value="Triche">';
      html += '<label for="mode_triche">Triche</label>';
      html += "<br><br>";
      html += '<button id="btn-retour">↩ Retour</button>';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-suivant">Suivant</button>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.newgame_ordi:
      ecran_actuel = ecran.newgame_ordi;
      html += "<h1>Nouvelle partie</h1>";
      html += "<p>Difficulté :</p>";
      html +=
        '<input type="radio" name="diff" id="diff_facile" value="Facile">';
      html += '<label for="diff_facile">Facile</label>';
      html +=
        '<input type="radio" name="diff" id="diff_normale" value="Normale">';
      html += '<label for="diff_normale">Normale</label>';
      html +=
        '<input type="radio" name="diff" id="diff_difficile" value="Difficile">';
      html += '<label for="diff_difficile">Difficile</label>';
      html += "<p>Mode :</p>";
      html +=
        '<input type="radio" name="mode" id="mode_manuel" value="Normal">';
      html += '<label for="mode_manuel">Manuel</label>';
      html +=
        '<input type="radio" name="mode" id="mode_triche" value="Triche">';
      html += '<label for="mode_triche">Triche</label>';
      html += "<br><br>";
      html += '<button id="btn-retour">↩ Retour</button>';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-suivant">Suivant</button>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.newgame_multi:
      html += "<h1>Nouvelle partie</h1>";
      html += '<button id="btn-join_game">Rejoindre</button>';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-create_game">Créer</button>';
      html += '<br><br>';
      html += '<button id="btn-retour">↩ Retour</button>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.file_select:
      html += "<h1>Selection du fichier de plateau</h1>";
      html += '<input type="file" id="file-input" accept=".json">';
      html += '<br><br>';
      html += '<button id="btn-retour">↩ Retour</button>';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-suivant">Suivant</button>';
      html += '<br><br>';
      html += '<a href="/magasin" target="_blank">Visiter le magasin de plateaux</a>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.join_game:
      html += "<h1>Entrez le code de la partie</h1>";
      html += '<input type="text" minlength="6" maxlength="6" placeholder="XXXXXX">';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-join">Rejoindre</button>';
      html += '<br><br>';
      html += '<button id="btn-retour">↩ Retour</button>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.waiting_room:
      html += "<h1>Le code de la partie est :</h1>";
      html += "<p id='id'></p>";
      html += "<p id='attente'>En attente (1/2)...</p>";
      html += '<button id="btn-play" class="disabled" disabled>Lancer</button>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.plateau:
      html += '<div id="plateau-container">';
      html += '<h1 id="tour"></h1>';
      html += '<div id="plateau"></div>';
      html += '</div>';
      html += '<div id="actions">';
      html += "<h1>Actions</h1>";
      html += '<button id="btn-new_question">Nouvelle question</button>';
      html += "<br><br>";
      html += '<button id="btn-new_devine">Deviner !</button>';
      html += "<br><br>";
      html += '<a href="#" id="btn-sauver" class="text-green">Sauver la partie</a>';
      html += '<br>';
      html += '<a href="#" id="btn-abandonner" class="text-red">Abandonner</a>';
      html += "<br><br>";
      html += '<h1>Historique</h1>';
      html += '<div id="tchat"></div>';
      html += "<br><br>";
      html += '<div id="sablier"><img src="https://cdn-icons-png.flaticon.com/512/3208/3208749.png"></img></div>';
      html += "</div>";
      $("#jeu").append(html);
      $("#jeu").show();
      break;
    case ecran.new_question:
      html += "<h1>Nouvelle question</h1>";
      html += '<div id="lignesContainer"></div>';
      html += '<br><br>';
      html += '<button id="btn-nouvelle_ligne">+ Nouvelle ligne</button>';
      html += '<button id="btn-retour_plateau">↩ Retour</button>';
      html += '<button id="btn-poser_question_auto">Question auto</button>';
      html += '<button id="btn-poser_question">Poser la question !</button>';
      $("#question").append(html);
      $("#question").show();
      break;
    case ecran.new_devine:
      html += "<h1>Ton personnage est...</h1>";
      html += '<div id="prenoms"></div>';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-deviner">Deviner !</button>';
      html += '<br><br>';
      html += '<button id="btn-retour">↩ Retour</button>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.evaluation:
      html += "<h1>La question est </h1>";
      html += '<p>Elle concerne   personnages</p>';
      html += '<button id="btn-retour">↩ Retour</button>';
      html += '<span class="spacer"></span>';
      html += '<button id="btn-suivant">Poser la question !</button>';      
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.reponse:
      html += "<h1>C'est </h1>";
      html += '<button id="btn-suivant">Continuer</button>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    case ecran.winner:
      html += '<h1 id="winner"></h1>';
      html += '<button id="btn-suivant">Nouvelle partie</button>';
      $("#dialog").append(html);
      $("#dialog").show();
      break;
    default:
      break;
  }
  ecran_actuel = nomEcran;
}

function clearEcran() {
  $("#message").empty().hide();
  $("#dialog").empty().hide();
  $("#jeu").empty().hide();
  $("#question").empty().hide();
}

function afficherMessage(message, type) {
  $("#message").removeClass(); // Supp toutes les classes
  switch (type) {
    case typeMessage.info:
      $("#message").addClass("bg-info");
      break;
    case typeMessage.alert:
      $("#message").addClass("bg-alert");
      break;
    case typeMessage.warning:
      $("#message").addClass("bg-warning");
      break;
  }
  $("#message").empty().append(message).show();
}

function afficherPlateau(plateau,codeJ) {
  console.log("affichage plateau " + codeJ);
  $("#plateau").empty();
  let delay = 200;
  for (let i in plateau[codeJ].personnages) {
    let html = '<div id="perso' + i + '" class="personnage ' + codeJ + ' hidden">';
    html += '<div class="front">';
    html += '<img src="' + plateau[codeJ].personnages[i].img + '" alt="' + plateau[codeJ].personnages[i].nom + '">'
    html += '</div>';
    html += '<div class="back ' + codeJ + '">';
    html += '</div>';
    html += '<p hidden id="nom_perso' + i + '" class="nom_perso">' + plateau[codeJ].personnages[i].nom + '</p>';
    html += '</div>';
    $("#plateau").append(html);
    setTimeout(function() {
      if(plateau[codeJ].personnages[i].visible == "true") {
          $("#perso" + i).removeClass("hidden");
          $("#nom_perso" + i).removeAttr("hidden");
        }
    }, delay);
    delay += 150;
    $("#perso" + i).on("click", () => {
      socket.emit("changer visibilite", {i,codeJ});
      if(!$("#perso" + i).hasClass("hidden")) {
        $("#perso" + i).toggleClass("hidden");
        $("#nom_perso" + i).fadeOut();
      } else {
        $("#perso" + i).toggleClass("hidden");
        $("#nom_perso" + i).fadeIn();
      }
    });
  }
}

// function afficherPlateau(plateau,codeJ) {
//   $("#plateau").empty();
//   $("#plateau").css("grid-template-rows","repeat(" + plateau[codeJ].personnages.length + ",10em)");
//   $("#plateau").css("grid-template-columns","repeat(" + plateau[codeJ].personnages.length + ",8em)");
//   for (let i in plateau[codeJ].personnages) {
//     let html = '<div id="perso' + i + '" class="personnage ' + codeJ + '">';
//     html += '<img src="' + plateau[codeJ].personnages[i].image + '" alt="' + plateau[codeJ].personnages[i].nom + '">';
//     html += '</div>';
//     $("#plateau").append(html);
//     if(plateau[codeJ].personnages[i].visible == false) {
//       $("#perso" + i + " img").css("display","none");
//     }
//     $("#perso" + i).on("click", () => {
//       if(true) { // TODO : Si c'est à son tour de jouer
//         if($("#perso" + i + " img").css("display") == "none") {
//           $("#perso" + i + " img").fadeIn();
//           // Changer visible en true dans le plateau
//           plateau[codeJ].personnages[i].visible = true;
//         } else {
//           $("#perso" + i + " img").fadeOut();
//           // Changer visible en false dans le plateau
//           plateau[codeJ].personnages[i].visible = false;
//         }
//       }
//     });
//   }
// }

function addSelectNom(tab, id, parentId) {
  let html = '<select id="' + id + '">';
  html += '<optgroup label="Attributs">';
  for (elem of tab) {
    html += "<option>" + elem + "</option>";
  }
  html += "</optgroup>";
  html += "</select>";
  $("#" + parentId).append(html);
}

function addSelectVal(tab, id, parentId) {
  let html = '<select id="' + id + '">';
  html += '<optgroup label="Valeurs">';
  for (elem of tab) {
    html += "<option>" + elem + "</option>";
  }
  html += "</optgroup>";
  html += "</select>";
  $("#" + parentId).append(html);
}

function addCaseNot(id, parentId) {
  let html = '<input type="checkbox" id="' + id + '">';
  html += '<label for="' + id + '">NON</label>';
  $("#" + parentId).append(html);
}

function addSelectConn(id, parentId) {
  let html = '<select id="' + id + '">';
  html += '<optgroup label="Connecteurs">';
  html += "<option>" + connecteurLogique.OU + "</option>";
  html += "<option>" + connecteurLogique.ET + "</option>";
  html += "</optgroup>";
  html += "</select>";
  $("#" + parentId).append(html);
}

function addLigneQuestion(id, tab) {
  let html = '<div id="ligne' + id + '" class="ligneQuestion"></div>';
  $("#lignesContainer").append(html);
  
  if (id != 0) {
    addSelectConn("conn" + id, "ligne" + id);
  }
  addCaseNot("not" + id, "ligne" + id);
  addSelectNom(Object.keys(tab), "nom" + id, "ligne" + id);
  addSelectVal(tab[$("#nom" + id).val()], "val" + id, "ligne" + id);

  if(id != 0) {
    $("#" + "ligne" + id).append('<button id="btn-suppr_ligne' + id + '" class="btn-suppr_ligne">-</button>');
    $("#btn-suppr_ligne" + id).on("click", () => {
      $("#" + "ligne" + id).remove();
    });
  }
  
  $("#nom" + id).on("change", () => {
    $("#val" + id).remove();
    addSelectVal(tab[$("#nom" + id).val()], "val" + id, "ligne" + id);
  });
}
