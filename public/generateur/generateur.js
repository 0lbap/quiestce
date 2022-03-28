// VARIABALES GLOBALES
var attributs = [];
var personnages = [];
var index_personnages = 0;
var index_attributs = 0;

class attribut {
  constructor(nom, valeur) {
    this.nom = nom;
    this.valeur = valeur;
  }
}

class personnage {
  constructor(nom, attributs, image) {
    this.nom = nom;
    this.img = image;
    this.visible = true;
    this.attributs = [];

    let att = new attribut(null, null);
    for (let i in attributs) {
      att = new attribut(attributs[i].nom, null);
      this.attributs.push(att);
    }
  }

  setAttribut(nom, valeur) {
    for (let a of this.attributs) {
      if (a.nom == nom) {
        a.valeur = valeur;
      }
    }
  }
}

function init() {
  let div = document.getElementById("perso_0");
  div.setAttribute("onclick", "ajout_personnage(0)");
}

function ajout_attribut() {
  let new_div = document.createElement("div");
  new_div.innerHTML =
    '<input id="attribut_' +
    index_attributs +
    '" type = "text"  value ="" placeholder="Exemple: Cheveux"><span class="spacer"></span><button style="color:red;" onclick="delete_attribut(' +
    index_attributs +
    ')">X</button><br>';
  new_div.style = "margin-top : 10px;";
  document.getElementById("attributs").appendChild(new_div);
  index_attributs++;
}
function delete_attribut(id) {
  valider_attribut();
  let container = document.getElementById("attributs");
  // edit les attributs des personnages
  for (const p of personnages) {
    p.attributs.splice(id, 1);
  }
  //delete attributs
  container.removeChild(container.children[id]);
  attributs.splice(id, 1);
  // edit des attribtus d' index > id
  index_attributs--;
  for (const child of container.children) {
    if (child.firstChild.id.split("_")[1] > id) {
      new_id = child.firstChild.id.split("_")[1] - 1;
      child.firstChild.id = "attribut_" + new_id;
      child.children[child.children.length - 2].setAttribute(
        "onclick",
        "delete_attribut(" + new_id + ")"
      );
    }
  }
  let popus = document.getElementsByClassName("popup");
  for (const popup of popus) {
    popup.remove();
  }
}
function reset_attributs() {
  index_attributs = 0;
  attributs = [];
  document.getElementById("attributs").innerHTML = "";

  for (const p of personnages) {
    p.attributs = attributs;
  }
  valider_attribut();
}

function valider_attribut() {
  let popups = document.getElementsByClassName("popup");
  let save_id = -1;
  if (popups.length > 0) {
    save_id = popups[0].id.split("_")[1];
    for (popup of popups) {
      valider_perso_attribut(popup.id.split("_")[1]);
    }
  }

  attributs = [];
  for (let i = 0; i < index_attributs; i++) {
    let value_imput = document.getElementById("attribut_" + i).value;
    let att = new attribut(value_imput, "null");
    attributs.push(att);
  }
  if (save_id >= 0) {
    input_personnage(save_id);
  }
}

function ajout_personnage(id) {
  index_personnages++;
  let new_div = document.createElement("div");
  new_div.className = "Personnage";
  new_div.id = "perso_" + index_personnages;
  new_div.innerHTML =
    '<h2 class ="perso" style="font-size:50px;font-weight:bold;text-align:center;" onclick="ajout_personnage(' +
    index_personnages +
    ')" >+</h2>';
  document.getElementById("plateau").appendChild(new_div);
  let ancien_perso = document.getElementById("perso_" + id);
  ancien_perso.innerHTML = '<h2 id ="perso_' + id + '" class ="perso">?</h2>';
  ancien_perso.setAttribute("onclick", "input_personnage(" + id + ")");
  input_personnage(id);
}

function input_personnage(id) {
  if (!document.getElementById("popup_" + id)) {
    let value_nom = "";
    let value_img = "";
    let value_attributs = [];
    for (const i in attributs) {
      value_attributs.push("");
    }
    if (personnages[id] != undefined) {
      value_nom = personnages[id].nom;
      value_img = personnages[id].img;
      for (const i in personnages[id].attributs) {
        value_attributs[i] = personnages[id].attributs[i].valeur;
      }
    }

    let new_div = document.createElement("div");
    new_div.id = "popup_" + id;
    new_div.className = "popup";
    let html =
      '<button style="margin-left:5px;color:red;position:absolute;left:0.5em;bottom:1.3em;" onclick="delete_personnage(' +
      id +
      ')">Supprimer</button>';
    html +=
      '<p class="elements_popup" >Nom : <input type="text" value="' +
      value_nom +
      '" id="nom_' +
      id +
      '" pattern="[A-Za-z]{3}" placeholder="Ex : Baptiste"> </p> ';
    html +=
      '<p class="elements_popup">Image : <input type="url" value="' +
      value_img +
      '" id="image_' +
      id +
      '" placeholder="https://..."> </p> ';
    for (const i in attributs) {
      html +=
        '<p class="elements_popup">' +
        attributs[i].nom +
        ' : <input type="text" value="' +
        value_attributs[i] +
        '" id="attribut_' +
        i +
        "_perso_" +
        id +
        '" placeholder= "Valeur1,Valeur2..."/> </p> ';
    }
    html +=
      '<button class="elements_popup" id="valider_perso_' +
      id +
      '" onclick="valider_perso_attribut(' +
      id +
      ')">Valider</button>';

    new_div.innerHTML = html;

    document.getElementById("generateur").prepend(new_div);

    let p = document.getElementsByClassName("popup");
    if (p.length > 1) {
      let old_id = p[p.length - 1].id.split("_")[1];
      valider_perso_attribut(old_id);
    }
  }
}

function delete_personnage(id) {
  index_personnages--;
  valider_perso_attribut(id);
  personnages.splice(id, 1);

  let container = document.getElementById("plateau");
  container.removeChild(container.children[id]);
  for (const child of container.children) {
    if (child.id.split("_")[1] > id) {
      new_id = child.id.split("_")[1] - 1;
      child.id = "perso_" + new_id;
      child.firstChild.id = "persosP_" + new_id;
      if (typeof child.firstChild.onclick == "function") {
        child.firstChild.setAttribute(
          "onclick",
          "ajout_personnage(" + new_id + ")"
        );
      } else {
        child.setAttribute("onclick", "input_personnage(" + new_id + ")");
      }
    }
  }
}

function delete_popup(id) {
  document.getElementById("popup_" + id).remove();
}

function valider_perso_attribut(id) {
  let nom = document.getElementById("nom_" + id).value;
  if (nom == "" || nom == "-1") {
    nom = "Perso n°" + id;
  }
  let image = document.getElementById("image_" + id).value;
  let perso = new personnage(nom, attributs, image);
  for (const i in attributs) {
    perso.attributs[i].valeur = document
      .getElementById("attribut_" + i + "_perso_" + id)
      .value.split(",");
  }

  // push dans personnages
  let bool = false;
  for (const i in personnages) {
    if (i == id) {
      personnages[i] = perso;
      bool = true;
    }
  }
  if (!bool) {
    personnages.push(perso);
  }

  let perso_div = document.getElementById("perso_" + id);
  perso_div.innerHTML = '<p id="persosP_' + id + '">' + nom + "</p>";
  perso_div.style.backgroundImage = 'url("' + image + '")';
  perso_div.style.backgroundSize = "100% 100%";
  perso_div.style.backgroundRepeat = "no-repeat";
  perso_div.setAttribute("onclick", "input_personnage(" + id + ")");
  delete_popup(id);
}

//check_validitite_plateau renvoi 1 si le plateau est valide sinon un array décrivant l'error
function check_validitite_plateau() {
  //check si il ya des attribut
  if (attributs.length == 0) {
    return [0];
  }
  if (personnages.length == 0) {
    return [-7];
  }
  //check si tout les attributs sont differents
  for (i in attributs) {
    for (j in attributs) {
      if (i != j && attributs[i].nom == attributs[j].nom) {
        return [-6];
      }
    }
  }
  //check si une bulle de modificatio nde personnage est ouverte
  if (document.getElementsByClassName("popup").length != 0) {
    return [-1];
  }
  //check si aucun personnage n'a le meme nom
  for (const p_1 of personnages) {
    for (const p_2 of personnages) {
      if (
        p_1.nom == p_2.nom &&
        personnages.indexOf(p_1) != personnages.indexOf(p_2)
      ) {
        return [-2, personnages.indexOf(p_1), personnages.indexOf(p_2)];
      }
    }
  }
  //check si tous les personnages ont le bon nombre d'attributs setAttribut
  for (const p of personnages) {
    if (p.attributs.length > attributs.length) {
      return [-3, personnages.indexOf(p)];
    } else if (p.attributs.length < attributs.length) {
      return [-4, personnages.indexOf(p)];
    }
    for (const a of p.attributs) {
      let b = Object.entries(a.valeur);
      console.log()
      if (b == "") {
        return [-4, personnages.indexOf(p)];
      }
    }
  }
  //check si tous les personnages sont disernable par leur attributs
  for (const p_1 of personnages) {
    for (const p_2 of personnages) {
      if (personnages.indexOf(p_1) != personnages.indexOf(p_2)) {
        let bool = false;
        for (const a_1 of p_1.attributs) {
          for (const a_2 of p_2.attributs) {
            if (a_1.nom == a_2.nom) {
              for (const v_1 of a_1.valeur) {
                for (const v_2 of a_2.valeur) {
                  if (v_1 != v_2) {
                    bool = true;
                  }
                }
              }
            }
          }
        }
        if (!bool) {
          return [-5, personnages.indexOf(p_1), personnages.indexOf(p_2)];
        }
      }
    }
  }

  //succes
  return 1;
}

function toJson() {
  let div_json = document.getElementById("json");
  let result_validite = check_validitite_plateau();

  if (result_validite == 1) {
    div_json.style.color = "black";
    document.getElementById("json_container").innerHTML =
      '<h2>Json :</h2><button href="#json_container" onclick="toJson()">Générer Json</button><span class="spacer"></span><button onclick="donwload_json()">Télécharger</button><br><br><pre id="json" class="prettyprint linenums"></pre>';
    div_json = document.getElementById("json");
    div_json.textContent = JSON.stringify(JSON.parse(genereJson()), null, 2);
    PR.prettyPrint(); // affiche le json joliement avec couleurs
  } else {
    div_json.style.color = "red";
    let nom;

    switch (result_validite[0]) {
      case 0:
        div_json.textContent = "Erreur : Aucun attribut n'a été définit";
        break;
      case -1:
        div_json.textContent =
          "Erreur : Au moins une edition de personnage est en cours";
        break;
      case -2:
        div_json.textContent =
          "Erreur : Le personnage n° " +
          result_validite[1] +
          " et n°" +
          result_validite[2] +
          " ont le meme nom";
        break;
      case -3:
        div_json.textContent =
          "Erreur : Le personnage : " +
          personnages[result_validite[1]].nom +
          " a trop d'attributs";
        break;
      case -4:
        div_json.textContent =
          "Erreur : Le personnage : " +
          personnages[result_validite[1]].nom +
          " n'a tous ses attributs définits";
        break;
      case -5:
        let nom_2;
        div_json.textContent =
          "Erreur : Les personnages " +
          personnages[result_validite[1]].nom +
          " et " +
          personnages[result_validite[2]].nom +
          " ont les memes valeur d'attributs";
        break;
      case -6:
        div_json.textContent = "Erreur : Deux attributs ont le memes nom";
        break;
      case -7:
        div_json.textContent = "Erreur : Aucun personnages n'a été definit";
        break;
      default:
        div_json.textContent = "Erreur : Erreur inconue";
        break;
    }
  }
}

function genereJson() {
  persos = '{ "personnage_cache":{"nom":"-1"},"personnages":[';

  for (const p of personnages) {
    let atts = "[";
    for (const i in p.attributs) {
      atts += '{"' + p.attributs[i].nom + '":[';
      for (const j in p.attributs[i].valeur) {
        if (j == p.attributs[i].valeur.length - 1) {
          atts += '"' + p.attributs[i].valeur[j] + '"';
        } else {
          atts += '"' + p.attributs[i].valeur[j] + '",';
        }
      }
      atts += "]}";
      if (i != p.attributs.length - 1) {
        atts += ",";
      }
    }
    atts += "]";

    persos +=
      '{"nom":"' +
      p.nom +
      '","visible":"' +
      p.visible +
      '","img":"' +
      p.img +
      '","attributs":' +
      atts +
      "}";
    if (personnages.indexOf(p) != personnages.length - 1) {
      persos += ",";
    }
  }
  persos += "]}";
  return '{"Tour":"undefined","J1":' + persos + ',"J2":' + persos + "}";
}

function donwload_json() {
  download(
    "Quiestce.json",
    JSON.stringify(JSON.parse(document.getElementById("json").textContent))
  ); // stringify de parse : remise du json en format compact sans espaces
}

function download(filename, text) {
  var element = document.createElement("a");

  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

window.onload = function () {
  document.getElementById("json-input").addEventListener("change", () => {
    let file = document.getElementById("json-input").files[0];
    readSingleFile(file);
  });
};

function readSingleFile(file) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var contents = e.target.result;
    try {
      load_json(JSON.parse(contents));
    } catch {
      console.log("erreur import du plateau");
    }
  };
  reader.readAsText(file);
}

function load_json(json) {
  json = json["J1"]["personnages"];
  //clear
  index_personnages = 0;
  index_attributs = 0;
  attributs = [];
  personnages = [];
  let att_div = document.getElementById("attributs");
  var child = att_div.lastElementChild;
  while (child) {
    att_div.removeChild(child);
    child = att_div.lastElementChild;
  }
  let div_plateau = document.getElementById("plateau");
  child = div_plateau.lastElementChild;
  while (child) {
    div_plateau.removeChild(child);
    child = div_plateau.lastElementChild;
  }
  let popus = document.getElementsByClassName("popup");
  for (const popup of popus) {
    popup.remove();
  }
  //import array
  for (const input_attribut of json[0].attributs) {
    let new_attribut = new attribut(
      Object.keys(input_attribut)[0],
      input_attribut[Object.keys(input_attribut)[0]]
    );
    attributs.push(new_attribut);
  }
  for (const input_perso of json) {
    let new_perso = new personnage(
      input_perso["nom"],
      attributs,
      input_perso["img"]
    );
    for (i in attributs) {
      new_perso.attributs[i].valeur =
        input_perso["attributs"][i][
          Object.keys(input_perso["attributs"][i])[0]
        ];
    }
    personnages.push(new_perso);
  }
  //génération html

  for (const attribut of attributs) {
    let new_div = document.createElement("div");
    new_div.innerHTML =
      '<input id="attribut_' +
      index_attributs +
      '" type = "text"  value ="' +
      attribut.nom +
      '"><span class="spacer"></span><button style="color:red;" onclick="delete_attribut(' +
      index_attributs +
      ')">X</button><br>';
    new_div.style = "margin-top : 10px;";
    document.getElementById("attributs").appendChild(new_div);
    index_attributs++;
  }

  for (const i in personnages) {
    let new_div = document.createElement("div");
    new_div.className = "Personnage";
    new_div.id = "perso_" + index_personnages;
    new_div.setAttribute("onclick", "input_personnage(" + i + ")");
    document.getElementById("plateau").appendChild(new_div);
    input_personnage(i);
    valider_perso_attribut(i);
    index_personnages++;
  }

  let new_div = document.createElement("div");
  new_div.className = "Personnage";
  new_div.id = "perso_" + index_personnages;
  new_div.innerHTML =
    '<h2 class ="perso" onclick="ajout_personnage(' +
    index_personnages +
    ')">+</h2>';
  document.getElementById("plateau").appendChild(new_div);
}
