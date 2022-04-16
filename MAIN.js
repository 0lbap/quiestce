  
//FICHIER REGROUPANT LES ENUMERATIONS ET LES CLASSES DU JEU AVEC LEURS FONCTIONS
//VOIR L'UML

//ENUMERATIONS

const connecteurs = {
  or: "or",
  and: "and",
  not: "not",
};

const codeJoueur = {
  j1: 1,
  j2: 2,
};

const modeDeJeu = {
  manuel: "Manuel",
  triche: "Triche",
  ordi: "Ordi",
};

const typeDePartie = {
  solo: "Solo",
  multi: "Multi",
  ordi: "Ordi",
};

//CLASSE ATTRIBUT

class attribut {
  
  //Constructeur
  
  constructor(nom, valeur) {
    this.nom = nom;
    this.valeur = valeur;
  }
}

//CLASSE FBF

class fbf {
  
  //Constructeur
  constructor(fbf1, connecteur, fbf2) {
    if (Number.isInteger(fbf1)) {
      this.value = { fbf1 }; //atomique
    }
    switch (connecteur) {
      case connecteurs.not:
        this.value = { not: { fbf1 } }; //Unaire not
        break;
      case connecteurs.or:
        this.value = { or: { fbf1, fbf2 } }; //Binaire or
        break;
      case connecteurs.and:
        this.value = { and: { fbf1, fbf2 } }; //binaire and
        break;
      default:
        break;
    }
  }

  //Methodes

  toString(atts) {
    let result = "";
    if (Number.isInteger(this.value.fbf1)) {
      result = this.value.fbf1;
      if (Array.isArray(atts)) {
        if(atts[result].nom == "prenom"){          
        result = "{ nom = " + atts[result].valeur + "}";
        }else{        
        result = "{" + atts[result].nom + " = " + atts[result].valeur + "}";
        }
      }
      return result;
    }
    if (this.value.not != null) {
      result = "Non(" + this.value.not.fbf1.toString(atts) + ")";
      return result;
    }
    if (this.value.or != null) {
      result =
        "(" +
        this.value.or.fbf1.toString(atts) +
        " Ou " +
        this.value.or.fbf2.toString(atts) +
        ")";
      return result;
    }
    if (this.value.and != null) {
      result =
        "(" +
        this.value.and.fbf1.toString(atts) +
        " Et " +
        this.value.and.fbf2.toString(atts) +
        ")";
      return result;
    }
  }

  eval(i) {
    if (Number.isInteger(this.value.fbf1)) {
      return i[this.value.fbf1];
    }
    if (this.value.not != null) {
      return !this.value.not.fbf1.eval(i);
    }
    if (this.value.or != null) {
      return this.value.or.fbf1.eval(i) || this.value.or.fbf2.eval(i);
    }
    if (this.value.and != null) {
      return this.value.and.fbf1.eval(i) && this.value.and.fbf2.eval(i);
    }
  }

  augmenterIndexFbf(entier){
    if(Number.isInteger(this.value.fbf1)){
      return new fbf((this.value.fbf1)+entier);
    }
    if(this.value.not != null){
      return new fbf(this.value.not.fbf1.augmenterIndexFbf(entier),connecteurs.not);
    }
    if(this.value.and != null){
      return new fbf(this.value.and.fbf1.augmenterIndexFbf(entier),connecteurs.and,this.value.and.fbf2.augmenterIndexFbf(entier));
    }
    if(this.value.or != null){
      return new fbf(this.value.or.fbf1.augmenterIndexFbf(entier),connecteurs.or,this.value.or.fbf2.augmenterIndexFbf(entier));
    }
  }
}

//CLASSE JOUEUR

class joueur {
  
  //Constructeur
  
  constructor(codej, json, mdj, partie) {
    this.codej = codej;
    this.json = json;
    this.mdj = mdj;
    this.partie = partie;
    this.plateau = new plateau(json, mdj);
  }

  //Methodes

  //methodes pout la génération de la question optimal
  // calcul du k+1 pour cf stratégie   https://arxiv.org/pdf/1509.03327.pdf?fbclid=IwAR3FvDtOjkcndTbTJhrucQcAVjX8BkRBpNUn37DA4MAJ8z5q8Nis74rx_18
  getNextPowerOf2(n, m) {
    if (n <= m) {
      return Math.pow(2, Math.ceil(Math.log2(n)));
    } else {
      return Math.pow(2, Math.ceil(Math.log2(m)));
    }
  }

  // calcul du parie a faire
  getBid(persos, n, m) {
    if (n < 2 || m < 2) {
      if (n == 1 || m == 1) {
        return 1;
      } else {
        console.log("erreur plateau de jeu imposible / getbid (n <1 || m <1)");
        return -1;
      }
    }
    let kpls = this.getNextPowerOf2(n, m);
    let k = kpls / 2;
    if (n >= kpls + 1 && k + 1 <= m && m <= kpls) {
      return parseInt(Math.pow(2, Math.floor(Math.log2(m - 1))));
    } else if (k + 1 <= n && n <= kpls && k + 1 <= m) {
      return parseInt(Math.floor(n / 2));
    } else {
      console.log("erreur kplus, config plateaus  = n: " + n + " : m: " + m);
      return -1; // erreur normalement innaccessible
    }
  }

  getQuestionOptimal(mdj) {
    // applciation difficulté & calcul du bid a faire
    let n = 0;
    let m = 0;
    let bid;
    
    for (let p of this.plateau.personnages) {
      if (p.visible == "true") {
        n++;
      }
    }
    if(this.partie.tdp == "Solo"){
      bid = Math.floor( 1/2 * n);
    }else{
    if(this.codej == 1){
            for (let p of this.partie.j2.plateau.personnages) {
                if (p.visible == "true") {
                  m++;
                }
          }
        }else{
            for (let p of this.partie.j1.plateau.personnages) {
                if (p.visible == "true") {
                  m++;
                }
          }
      
      }
      bid = this.getBid(this.plateau.personnages,n,m);
      if(mdj != modeDeJeu.triche){
            let random = Math.random() * this.partie.diff_ordi
            if (random > 0.75) {
                bid = n;
            }
      }

    }
    if (bid < 1) {
      bid = 1;
    }
    if (bid > n) {
      bid = n;
    }
    //fin application difficulté & calcul du bid a faire
    
    if (bid == 1) {
      for (const p of this.plateau.personnages) {
        if (p.visible == "true") {
          return new question(new fbf(0), [p.attributs[0]]);
        }
      }
    } else {      
      return this.initQuestion(this.plateau.personnages, bid);
    }
  }

  // génération de la question

  includesObject(array, object) {
    //marche que pour les class attribut
    let check = false;
    for (const a of array) {
      if (a.nom == object.nom && a.valeur == object.valeur) {
        check = true;
      }
    }
    return check;
  }

  getAllAttributs(personnages) {
    let attributs = [];
    for (const p of personnages) {
      if(p.visible == "true"){
      for (const attribut_perso of p.attributs) {
        if (attribut_perso.nom != "prenom" && attribut_perso != "visible") {
          if (Array.isArray(attribut_perso.valeur)) {
            // si l'attribut a plusieur valeur
            for (const valeur_att of attribut_perso.valeur) {
              if (Array.isArray(valeur_att)) {
                for (const v of valeur_att) {
                  let a = new attribut(attribut_perso.nom, v);
                  if (!this.includesObject(attributs, a)) {
                    attributs.push(a);
                  }
                }
              } else {
                let a = new attribut(attribut_perso.nom, valeur_att);
                if (!this.includesObject(attributs, a)) {
                  attributs.push(a);
                }
              }
            }
          } else {
            let a = new attribut(attribut_perso.nom, attribut_perso.valeur);
            if (!this.includesObject(attributs, a)) {
              attributs.push(a);
            }
          }
        }
      }
    }
    }
    return attributs;
  }

  initQuestion(personnages, bid) {
    let questions = [];
    let attributs_possible = this.getAllAttributs(personnages);
    for (let att of attributs_possible) {
      let q = new question(new fbf(0), [att]);
      let concerne = this.plateau.compte_personage_concerne(q);
      questions.push([q, concerne, 1000 * concerne, 0]);
      // question[0] est la question question[1/2] est le nombre de personnage concerné par la question , question[3] est si la question a était utilsié pour en généré d'autres
    }
    return this.genereArbreQuestions(questions, bid,3);
  }

  genereArbreQuestions(questions,bid,iteration){
// question[0] est la question question[1] est le nombre de personnage concerné par la question, question[2] idem mais de la question mère a celle-ci , question[] est si la question a était utilsié pour en généré d'autres
//check ancienne question
  if(iteration == 0){
    let diff = bid
    let q = questions[0] 
    for(const question of questions){
      if(Math.abs(bid-question[1]) < diff ){diff =Math.abs(
        bid-question[1])
        q = question
       }
    }
    return q[0]
    
  }
  
  for(const question of questions){
    if(question[1]  >=  bid-(bid*0.1) && question[1]  <=  bid+(bid*0.1) ){ 
      return question[0]
    }    
  }
// génération de nouvelle questions
  let new_questions = []
  for(const q of questions){
    if(q[3] == 0){

   // génération avec Not    
      let new_question = new question(new fbf(q[0].fbf,connecteurs.not),q[0].attributs) // génération nouvelle question
      let concerne = this.plateau.compte_personage_concerne(new_question)
      // test si la question doit etre ajouter      
      if(q[1] != concerne && ( Math.abs(bid-concerne) < Math.abs(bid-q[2]))){
        new_questions.push([new_question,concerne,q[1],0])
      }        
  
      for(const q2 of questions){//génération binaire          
          let atts = q[0].attributs.concat(q2[0].attributs) // union est attribut des questions
          // génération avec Or   
          let new_question = new question(new fbf( q[0].fbf,connecteurs.or,q2[0].fbf.augmenterIndexFbf(q[0].attributs.length)) ,atts ) // génération nouvelle question
          let concerne = this.plateau.compte_personage_concerne(new_question)
        
          if(q[1] != concerne && ( Math.abs(bid-concerne) < Math.abs(q[2]))){
            new_questions.push([new_question,concerne,q[1],0])
          }
          // génération avec and
          new_question = new question(new fbf( q[0].fbf,connecteurs.and,q2[0].fbf.augmenterIndexFbf(q[0].attributs.length)) ,atts ) // génération nouvelle question
          concerne = this.plateau.compte_personage_concerne(new_question)
        
          if(q[1] != concerne && ( Math.abs(bid-concerne) < Math.abs(q[2]))){
            new_questions.push([new_question,concerne,q[1],0])
          }
        }
      }
    
    q[3] = 1
  }

  for(const q of new_questions){
    questions.push(q)
  }
  return this.genereArbreQuestions(questions,bid,(iteration-1)) 
  
}


}

class partie {
  
  //Constructeur
  
  constructor(json_j1, json_j2, tdp, mdj1, mdj2, diff_ordi) {
    this.json = '{"J1":'+JSON.stringify(json_j1)
+',"J2":'+JSON.stringify(json_j2)+'}'
    this.tdp = tdp;
    this.diff_ordi = diff_ordi;
    this.j1 = new joueur(codeJoueur.j1, json_j1, mdj1, this);
    if (!(tdp == typeDePartie.solo)) {
      this.j2 = new joueur(codeJoueur.j2, json_j2, mdj2, this);
    }
  }

  // Methodes
  save(){
    let json_save = JSON.parse(this.json)
    // pour J1
    json_save['J1']['personnage_cache']['nom'] = this.j1.plateau.personnage_cache.attributs[0].valeur[0]
    for(const i in json_save['J1']['personnages']){
      json_save['J1']['personnages'][i]['visible'] = this.j1.plateau.personnages[i].visible
    }    
    // pour j2
    if(this.tdp == typeDePartie.multi) {
      json_save['J2']['personnage_cache']['nom'] = this.j2.plateau.personnage_cache.attributs[0].valeur[0]
      for(const i in json_save['J2']['personnages']){
        json_save['J2']['personnages'][i]['visible'] = this.j2.plateau.personnages[i].visible
      }
    } else {
      json_save['J2']['personnage_cache']['nom'] = this.j1.plateau.personnage_cache.attributs[0].valeur[0]
      for(const i in json_save['J2']['personnages']){
      json_save['J2']['personnages'][i]['visible'] = this.j1.plateau.personnages[i].visible
      }
    }
    
  return '"J1":'+JSON.stringify(json_save['J1']) + ',"J2":'+JSON.stringify(json_save['J2'])
  }
}

class personnage {
  
  //Constructeur
  
  constructor(nom, attributs, visible) {
    this.visible = visible;
    this.attributs = [];

    let prenom = new attribut("prenom", [nom]);
    this.attributs.push(prenom);

    let att = new attribut(null, null);
    for (let i in attributs) {
      att = new attribut(attributs[i].nom, null);
      this.attributs.push(att);
    }
  }
  
  //Methodes
  
  interpretation(question) {
    let i = [];
    for (const att_question of question.attributs) {
      let bool = false;
      for (const att_perso of this.attributs) {
        if (att_question.nom == att_perso.nom) {
          if (Array.isArray(att_question.valeur)) {
            //cas si la valeur de l'attribut question est un array
            for (const att_question_valeur of att_question.valeur) {
              if (att_perso.valeur[0].includes(att_question_valeur)) {
                bool = true;
              }
            }
          } else {
            //si c'est une valeur unique
            if (att_perso.valeur[0].includes(att_question.valeur)) {
              bool = true;
            }
          }
        }
      }
      i.push(bool);
    }
    return i;
  }

  questionner(q) {
    return q.fbf.eval(this.interpretation(q));
  }

  setAttribut(nom, valeur) {
    for (let a of this.attributs) {
      if (a.nom == nom) {
        a.valeur = valeur;
      }
    }
  }
}

//CLASSE PLATEAU

class plateau {
  
  //Constructeur

  constructor(json, mdj) {
    this.json = json;
    this.mdj = mdj;
    this.attributs = [];
    this.personnages = [];

    this.json.personnages[0].attributs.forEach((a) => {
      let att;
      for (const [key, value] of Object.entries(a)) {
        att = new attribut(key, "null");
      }
      this.attributs.push(att);
    });
    this.json.personnages.forEach((p) => {
      let perso = new personnage(p.nom, this.attributs, p.visible);
      p.attributs.forEach((a) => {
        let values = [];
        let id;
        for (const [key, value] of Object.entries(a)) {
          id = key;
          values.push(value);
        }
        for (const att of perso.attributs) {
          if (att.nom == id) {
            att.valeur = values;
          }
        }
      });
      this.personnages.push(perso);
    });

    //selection perso caché
    //peut etre ajotué un choix manuel par paramètre
    if (json["personnage_cache"].nom == -1) {
      // attribution aléatoire du personnages caché
      let r = Math.round(Math.random() * (this.personnages.length - 1));
      while (this.personnages[r].visible == "false") {
        r = (r + 1) % this.personnages.length;
      }
      this.personnage_cache = this.personnages[r];
    } else {
      //attribution spécifié du personnage caché
      for (const p of this.personnages) {
        if (p.attributs[0].valeur == json["personnage_cache"].nom) {
          this.personnage_cache = p;
        }
      }

      if (this.personnage_cache === undefined) {
        console.log("echec selection personnage caché - attribution aléatoire");
        let r = Math.round(Math.random() * (this.personnages.length - 1));
        while (this.personnages[r].visible == "false") {
          r = (r + 1) % this.personnages.length;
        }
        this.personnage_cache = this.personnages[r];
      }
    }
  }

  //Methodes
  
  cache_auto(q, bool) {
    for (let p of this.personnages) {
      if (p.visible == "true") {
        if (p.questionner(q) != bool) {
          p.visible = "false";
        }
      }
    }
  }

  poser_question(q) {
    if (this.mdj != modeDeJeu.manuel) {
      this.cache_auto(q, this.personnage_cache.questionner(q));
    }
    return this.personnage_cache.questionner(q);
  }

  compte_personage_concerne(question) {
    let nb_concerne = 0;
    for (const perso of this.personnages) {
      if (perso.questionner(question)) {
        if (perso.visible == "true") {
          nb_concerne++;
        }
      }
    }

    return nb_concerne;
  }

  compte_visible() {
    let nb_visible = 0;
    for (const p of this.personnages) {
      if (p.visible == "true") {
        nb_visible++;
      }
    }
    return nb_visible;
  }

  toggle_visible(index) {
    let p = this.personnages[index];
    if (p.visible == "true") {
      p.visible = "false";
    } else {
      p.visible = "true";
    }
  }
}

//CLASSE QUESTION

class question {
  
  //Constructeur
  
  constructor(fbf, attributs) {
    this.fbf = fbf;
    this.attributs = [];
    for (let a of attributs) {
      this.attributs.push(a);
    }
  }
}

module.exports = {
  attribut,
  connecteurs,
  fbf,
  codeJoueur,
  joueur,
  modeDeJeu,
  typeDePartie,
  partie,
  personnage,
  plateau,
  question,
};
