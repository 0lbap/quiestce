// VARIABALES GLOBALES
var attributs = []
var personnages = []
var index_personnages = 0
var index_attributs = 0




class attribut{
  constructor(nom,valeur){
    this.nom = nom
    this.valeur = valeur
  } 
}

class personnage{

  // cosntructeur
  constructor(nom,attributs,image){
    this.nom = nom
    this.img = image
    this.visible = true
    this.attributs = []
    

    let att = new attribut(null,null)
    for (let i in attributs){
      att = new attribut(attributs[i].nom,null)
      this.attributs.push(att)
    }
  }  
  
  
  setAttribut(nom,valeur){
    for(let a of this.attributs){
      if(a.nom == nom){a.valeur = valeur}
      }
  }

}

function onClickAddPerso(event){
  ajout_personnage(event.target.id.split('_')[1])
}

function onClickInputPerso(event){
  input_personnage(event.target.id.split('_')[1])
}
 

function init(){
  let div = document.getElementById('perso_0')
  div.addEventListener('click',() => {onClickAddPerso(event)})
}

function ajout_attribut(){

  let new_div = document.createElement("div")
  new_div.innerHTML = '<input id="attribut_'+ index_attributs +'" type = "text"  value =""><br>'
  new_div.style="margin-top : 10px;"
  document.getElementById("attributs").appendChild(new_div)
  index_attributs++
  
}

function reset_attributs(){
  index_attributs=0;
  attributs= [];
  document.getElementById("attributs").innerHTML = ""

  for (const p of personnages){
    p.attributs = attributs;
  }
}

function valider_attribut(){
  let check = true
  if(document.getElementById('attributs').children.length == 0){
     check = false
  }
  for(const attribut_1 of document.getElementById('attributs').children){
    if(attribut_1.firstChild.value == null || attribut_1.firstChild.value == ''){
      check = false;
      break;
    }
    for(const attribut_2 of document.getElementById('attributs').children){
       if(attribut_1.firstChild.id != attribut_2.firstChild.id && attribut_1.firstChild.value == attribut_2.firstChild.value){
         check = false;
         break;         
       }
    }
  
  }
  

  attributs = []
  for(let i = 0 ; i< index_attributs ; i++){
    let value_imput = document.getElementById('attribut_'+i).value
    let att = new attribut(value_imput,"null")
    attributs.push(att)
  }
  
}

function ajout_personnage(id){
  index_personnages++  
  let new_div = document.createElement('div')
  new_div.className = "Personnage"
  new_div.id = "perso_"+index_personnages
  new_div.innerHTML = '<p class ="perso" style="font-size:50px;font-weight:bold;text-align:center;" onclick="ajout_personnage('+index_personnages+')" >+</p>' 
  document.getElementById('plateau').appendChild(new_div)


  let ancien_perso = document.getElementById("perso_"+id)
  ancien_perso.innerHTML ='<p id ="perso_'+id+'" class ="perso" style="font-size:50px;font-weight:bold;text-align:center"" >?</p>'   
  ancien_perso.replaceWith(ancien_perso.cloneNode(true));  
  input_personnage(id)
  
  
}


function input_personnage(id){


if(!document.getElementById('popup_'+id)){
//  personnages[x][0] est l'index dans le plateau du persoinnage personnages[x][1]
  let value_nom = ''
  let value_img = ''
  let value_attributs = []
  for(const i in attributs){
    value_attributs.push('')
  }
  for(const p of personnages){
    if(p[0] == id){
      value_nom = p[1].nom
      value_img = p[1].img
      for(const i in p[1].attributs){
        value_attributs[i] = p[1].attributs[i].valeur
        
      }
    }
  }
  let new_div = document.createElement('div')
  new_div.id = 'popup_'+id
  new_div.className = 'popup'
  let html = ''
  html += '<p class="elements_popup" >Nom : <input type="text" value="'+value_nom+'" id="nom_'+id+'" pattern="[A-Za-z]{3}"> </p> '
  html += '<p class="elements_popup">Image : <input type="text" value="'+value_img+'" id="image_'+id+'"> </p> '
  for(const i in attributs){
    html += '<p class="elements_popup">'+attributs[i].nom+' : <input type="text" value="'+value_attributs[i]+'" id="attribut_'+i+'_perso_'+id+'"> </p> '
  } 
  html += '<button class="elements_popup" id="valider_perso_'+id+'" onclick="valider_perso_attribut('+id+')">Valider</button>'
  new_div.innerHTML = html

  document.getElementById('generateur').prepend(new_div) 

let p = document.getElementsByClassName('popup')
if(p.length > 1){
  let old_id = p[p.length -1].id.split('_')[1]
  valider_perso_attribut(old_id)
}
}}



function delete_popup(id){
  document.getElementById('popup_'+id).remove()
}

function valider_perso_attribut(id){

  let nom = document.getElementById('nom_'+id).value
  if(nom == ''){
    nom = 'Perso n°'+id
  }
  let image = document.getElementById('image_'+id).value
  let perso = new personnage(nom,attributs,image)
  for(const i in attributs){
    perso.attributs[i].valeur = document.getElementById('attribut_'+i+'_perso_'+id).value.split(',')
  }

  // push dans personnages [index dans le plateau , le personnage]
  // donc personnages[x][0] est l'index dans le plateau du persoinnage personnages[x][1]
  let bool = false
  for(const i in personnages){
    if(personnages[i][0] == id){
      personnages[i] = [id,perso]
      bool = true
    }
  }
  if(!bool){
    personnages.push([id,perso])
  }
  
  

  let perso_div = document.getElementById("perso_"+id)

  perso_div.innerHTML = '<p id="persosP_'+id+'" style="font-size:2em;"">'+nom+'</p>'
  perso_div.style.backgroundImage ='url("'+image+'")' 
  perso_div.style.backgroundSize ='100% 100%';
  perso_div.style.backgroundRepeat ='no-repeat';
  
  perso_div.addEventListener('click',() => {onClickInputPerso(event)})
  delete_popup(id)


 //<img src="'+image+'" onclick="input_personnage('+id+')" position:absolute;"></img> ' 
}

/*
check_validitite_plateau renvoi 1 si le plateau est valide sinon un array décrivant l'error


*/
function check_validitite_plateau(){
  //check si il ya des attribut
  if(attributs.length == 0){
    return [0]
  }
  //check si tout les attributs sont differents
  for(i in attributs){
    for (j in attributs){
      if(i != j && attributs[i].nom == attributs[j].nom){
        return [-6]
      }
    }
  }
  //check si une bulle de modificatio nde personnage est ouverte
  if(document.getElementsByClassName('popup').length !=0){
    return [-1]
  }
  //check si aucun personnage n'a le meme nom
  for(const p_1 of personnages){
    for(const p_2 of personnages){
      if(p_1[1].nom == p_2[1].nom && p_1[0] != p_2[0]){
        return [-2,p_1[0],p_2[0]]
      }
    }
  }
  //check si tous les peersonnages ont le bon nombre d'attributs setAttribut
  for(const p of personnages){
   if(p[1].attributs.length > attributs.length){
     return [-3,p[0]]
   }else if(p[1].attributs.length < attributs.length){
     return [-4,p[0]]
   }   
  }  
  //check si tous les personnages sont disernable par leur attributs
  for(const p_1 of personnages){
    for(const p_2 of personnages){
        if( p_1[0] != p_2[0]){
        let bool = false
        for(const a_1 of p_1[1].attributs){
          for(const a_2 of p_2[1].attributs){
            if( a_1.nom == a_2.nom){              
              for(const v_1 of a_1.valeur){
                for(const v_2 of a_2.valeur){
                  if(v_1 != v_2){
                    bool = true
                  }
                }
              }
            }
          }
        }
        if(!bool){
          return [-5,p_1[0],p_2[0]]
        }
      }
      
    }
  }

  //succes
 return 1
}

function toJson(){
  let div_json = document.getElementById('json')
  let result_validite = check_validitite_plateau()

  if(result_validite == 1){
    div_json.style.color = 'black'
    document.getElementById('json_container').innerHTML = '<h2>Json :</h2><button onclick="toJson()">Genere Json</button><button onclick="donwload_json()">Donwload</button><div id="json"></div>'
    div_json = document.getElementById('json')
    div_json.textContent = genereJson() // genere et affiche le json
  }else{
    div_json.style.color = 'red'
    let nom

    switch (result_validite[0]){
      case  0:
        div_json.textContent = "Erreur :Aucun attribut n'a été définit"
        break; 
      case -1: 
        div_json.textContent = "Erreur : Au moins une edition de personnage est en cours"        
        break;
      case -2:
        div_json.textContent = "Erreur : Le personnage n° "+result_validite[1]+" et n°"+result_validite[2] + " ont le meme nom"    
        break;
      case -3:
        for(const p of personnages){
          if(p[0] == result_validite[1]){
            nom = p[1].nom
          }
        }
        div_json.textContent = "Erreur : Le personnage : "+nom+" a trop d'attributs"
        break;
      case -4:
        for(const p of personnages){
          if(p[0] == result_validite[1]){
             nom = p[1].nom
          }
        }
        div_json.textContent = "Erreur : Le personnage : "+nom+" n'a tous ses attributs définits"
        break;
      case -5:
      let nom_2
      for(const p of personnages){
          if(p[0] == result_validite[1]){
             nom = p[1].nom
          }
        }
      for(const p of personnages){
          if(p[0] == result_validite[2]){
             nom_2 = p[1].nom
          }
        }
        div_json.textContent = "Erreur : Les personnages "+nom+" et "+nom_2+" ont les memes valeur d'attributs"
        break;
      case -6:
        div_json.textContent = "Erreur : Deux attributs ont le memes nom"
        break;        
      default:
        div_json.textContent = "Erreur : Erreur inconue"       

    }
  }
  
}

function genereJson(){
  persos = '{ "personnage_cache":{"nom":"-1"},"personnages":['

  for(const p of personnages){
    console.log(p)
    let atts = '['
    for(const i in p[1].attributs){

      atts += '{"'+p[1].attributs[i].nom+'":['
      for(const j in p[1].attributs[i].valeur){
        if( j == p[1].attributs[i].valeur.length-1){
          atts += '"'+p[1].attributs[i].valeur[j]+'"'
        }else{
          atts += '"'+p[1].attributs[i].valeur[j]+'",'
        }
      }
      atts += ']}'
      if(i != p[1].attributs.length-1){
        atts +=','
      }
    }
    atts += ']'
    
    persos += '{"nom":"'+p[1].nom+'","visible":"'+p[1].visible+'","img":"'+p[1].img+'","attributs":'+atts+'}'
    if(personnages.indexOf(p) != personnages.length-1){
      persos += ','
    }
    
    
  }
  persos += ']}'
  return '{"Tour":"undefined","J1":'+persos+',"J2":'+persos+'}'

}

function donwload_json(){
  download("Quiestce.json",document.getElementById('json').textContent)
}

function download(filename, text) {
  var element = document.createElement('a');
  
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}