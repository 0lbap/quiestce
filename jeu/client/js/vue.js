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
    reponse: "reponse",
    winner: "winner"
}

const typeMessage = {
    info: "info",
    alert: "alert",
    warning: "warning"
}

const connecteurLogique = {
  NOT: "NOT",
  AND: "AND",
  OR: "OR"
}

var ecran_actuel;

function afficherEcran(nomEcran) {
    clearEcran();
    console.log("Écran " + nomEcran + " affiché");
    let html='';
    switch (nomEcran) {
        case ecran.pseudo:
            html+='<h1>Entrez votre pseudo :</h1>';
            html+='<input type="text" id="pseudo" placeholder="mon_pseudo_cool">';
            html+='<span class="spacer"></span>';
            html+='<button id="btn-suivant">OK</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.newgame:
            html+='<h1>Nouvelle partie</h1>';
            html+='<button id="btn-newgame_solo">Solo</button>';
            html+='<span class="spacer"></span>';
            html+='<button id="btn-newgame_ordi">Contre l\'ordi</button>';
            html+='<span class="spacer"></span>';
            html+='<button id="btn-newgame_multi">Multijoueur</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.newgame_solo:
            html+='<h1>Nouvelle partie</h1>';
            html+='<p>Mode :</p>';
            html+='<input type="radio" name="mode" id="mode_normal" value="Normal">';
            html+='<label for="mode_normal">Normal</label>';
            html+='<br>';
            html+='<input type="radio" name="mode" id="mode_triche" value="Triche">';
            html+='<label for="mode_triche">Triche</label>';
            html+='<br><br>';
            html+='<button id="btn-suivant">Suivant</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.newgame_ordi:
            ecran_actuel = ecran.newgame_ordi;
            html+='<h1>Nouvelle partie</h1>';
            html+='<p>Difficulté :</p>';
            html+='<input type="radio" name="diff" id="diff_facile" value="Facile">';
            html+='<label for="diff_facile">Facile</label>';
            html+='<input type="radio" name="diff" id="diff_normale" value="Normale">';
            html+='<label for="diff_normale">Normale</label>';
            html+='<input type="radio" name="diff" id="diff_difficile" value="Difficile">';
            html+='<label for="diff_difficile">Difficile</label>';
            html+='<p>Mode :</p>';
            html+='<input type="radio" name="mode" id="mode_normal" value="Normal">';
            html+='<label for="mode_normal">Normal</label>';
            html+='<input type="radio" name="mode" id="mode_triche" value="Triche">';
            html+='<label for="mode_triche">Triche</label>';
            html+='<br><br>';
            html+='<button id="btn-suivant">Suivant</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.newgame_multi:
            html+='<h1>Nouvelle partie</h1>';
            html+='<button id="btn-join_game">Rejoindre</button>';
            html+='<span class="spacer"></span>';
            html+='<button id="btn-create_game">Créer</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.file_select:
            html+='<h1>Selection du fichier de plateau</h1>';
            html+='<input type="file" id="file-input" accept=".json">';
            html+='<span class="spacer"></span>';
            html+='<button id="btn-suivant">Suivant</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.join_game:
            html+='<h1>Entrez le code de la partie</h1>';
            html+='<input type="text">';
            html+='<span class="spacer"></span>';
            html+='<button id="btn-play">Rejoindre</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.waiting_room:
            html+='<h1>Le code de la partie est :</h1>';
            html+='<p>XXXX</p>';
            html+='<p>En attente (1/2)...</p>';
            html+='<button id="btn-play">Lancer</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.plateau:
            html+='<div id="plateau-container"><h1>C\'est au tour de Jx</h1></div>';
            html+='<div id="actions">';
            html+='<h1>Actions</h1>';
            html+='<button id="btn-new_question">Nouvelle question</button>';
            html+='<br><br>';
            html+='<button id="btn-new_devine">Deviner !</button>';
            html+='<br><br>';
            html+='<button id="btn-fin_tour">Finir le tour</button>';
            html+='<br><br>';
            html+='<a href="#" id="btn-abandonner">Abandonner</a>';
            html+='</div>';
            $("#jeu").append(html);
            $("#jeu").show();
            showPlateau();
            break;
        case ecran.new_question:
            html+='<h1>Nouvelle question</h1>';
            html+='<button id="btn-poser_question">Poser la question !</button>';
            $("#question").append(html);
            $("#question").show();
            // Test :
            let nomsAtt = ["Prénom", "Lunettes", "Cheveux"];
            let valsAtt = ["Vincent", "Caroline"];
            addSelectNom(nomsAtt,"nom0");
            $("#question").append(" : ");
            addSelectVal(valsAtt,"val0");
            // fin Test
            break;
        case ecran.new_devine:
            html+='<h1>Ton personnage est...</h1>';
            html+='<input id="prenom" type="text" placeholder="Prénom">';
            html+='<span class="spacer"></span>';
            html+='<button id="btn-deviner">Deviner !</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.reponse:
            html+='<h1>C\'est vrai//faux !</h1>';
            html+='<button id="btn-suivant">Continuer</button>';
            $("#dialog").append(html);
            $("#dialog").show();
            break;
        case ecran.winner:
            html+='<h1>Jx a gagne !</h1>';
            html+='<button id="btn-suivant">Nouvelle partie</button>';
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

function afficherMessage(message,type) {
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

function showPlateau() {
    $("#plateau").append("<p>okok</p>");
}

function addSelectNom(tab, id) {
    let html = '<select id="' + id + '">';
    html+= '<optgroup label="Attributs">';
    for (elem of tab) {
        html += '<option>' + elem + '</option>';
    }
    html += '</optgroup>';
    html += '<optgroup label="Connecteurs">';
    html += '<option>' + connecteurLogique.NOT + '</option>';
    html += '<option>' + connecteurLogique.OR + '</option>';
    html += '<option>' + connecteurLogique.AND + '</option>';
    html += '</optgroup>';
    html += '</select>';
    $("#question").append(html);
}

function addSelectVal(tab, id) {
    let html = '<select id="' + id + '">';
    for (elem of tab) {
        html += '<option>' + elem + '</option>';
    }
    html += '</select>';
    $("#question").append(html);
}
// Pour supp un select on fait $("#idDuSelect").remove()
