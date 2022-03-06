# quiestce

[![OS](https://img.shields.io/badge/OS-macOS,Windows,Linux-blue.svg)](https://shields.io/)
[![Made_with](https://img.shields.io/badge/Made_with-Javascript,Node.js-blue.svg)](https://shields.io/)
[![Version](https://img.shields.io/badge/Version-1.0-default.svg)](https://shields.io/)

Projet de Programmation du S4.

Consigne : Réaliser le jeu du _Qui-est-ce_ avec le langage de programmation de votre choix.

## Accès direct

Le projet a été travaillé sur un serveur [Replit](https://replit.com/@Ethazio/Qui-est-ce) Node.js.

Il est également déployé sur un serveur personnel à l'[adresse suivante](https://elliotburns.com/) (beaucoup plus performant).

## Déploiement

Si vous souhaitez déployer le jeu en local, suivez les instructions.

1. Téléchargez et installez [Node.js](https://nodejs.org/en/download/)
2. Clonez ce repository dans un dossier nommé `quiestce`
3. Ouvrez un terminal et rendez vous dans le dossier `quiestce`
4. Installez les dépendances avec `npm install`
5. Lancez le serveur avec `node index.js`
6. Rendez vous sur http://localhost:8000 pour voir le rendu !

## Vue d'ensemble de l'interface

Cette section expliquera les différentes pages du jeu et comment y jouer.

### Jeu

La page principale du site est le Jeu. Vous pouvez accéder au magasin de plateaux (pour télécharger des plateaux json), au générateur (pour créer votre propre plateau json) ou bien simplement commencer une partie en entrant votre pseudo.

Une fois votre pseudo entré, vous pouvez choisir un type de partie :
1. _Solo_ : vous jouez sans adversaire, le personnage à deviner est tiré aléatoirement
2. _Contre l'ordi_ : vous jouez contre l'ordi, à une difficulté donnée
3. _Multijoueur_ : vous jouez avec un ami qui vous rejoindra avec un code

> Note : Les modes _Contre l'ordi_ et _Multijoueur_ sont en cours de développement et peuvent provoquer des erreurs.

Ensuite, si vous êtes en _Solo_ ou en _Contre l'ordi_, vous pouvez choisir le mode de jeu :
1. _Normal_ : partie classique sans outils supplémentaires
2. _Triche_ : partie avec des outils permettant de retourner les personnages automatiquement, d'évaluer l'efficacité de votre question ou de générer une bonne question

Si vous êtes en mode _Contre l'ordi_, il vous sera aussi demandé de renseigner la difficulté : _Facile_, _Normale_, ou _Difficile_.

Si vous êtes en mode _Multijoueur_, vous choisirez entre _Rejoindre_ ou _Créer_ une partie. Ce sera alors à la personne qui crée la partie d'envoyer un plateau au serveur.

La page suivante concerne l'envoi du fichier de plateau (sous format json) au serveur. Veillez à ce que votre plateau soit au bon format et gagnable (ceux qui sont générés par notre générateur sont valides). Dans le cas contraire, une erreur pourrait survenir.

L'écran suivant affiche le plateau de jeu et les _Actions_. Le dos des cartes est bleu pour le joueur 1, et rouge pour le joueur 2. Pour retourner une carte, il vous suffit de cliquer dessus, même si ce n'est pas votre tour. En haut à gauche est affiché le tour. Si ce n'est pas votre tour, un sablier s'affiche et les boutons d'actions deviennent innaccessibles.

Les différentes actions possible sont :
1. _Nouvelle question_ : vous renvoie sur l'écran de création de la question
2. _Deviner !_ : pour poser une question sur un prénom uniquement (seule façon de gagner)

L'écran de création de la question est composé de lignes reliées par des connecteurs logiques (ET / OU). Vous pouvez ajouter une ligne en cliquant sur _+ Nouvelle ligne_. Chaque ligne comporte un attribut (ex. Cheveux) ainsi qu'une valeur (ex. Blond), sélectionnés parmis toutes les possibilités. Quand la question vous satisfait, vous pouvez la poser, ou, si vous êtes en mode _Triche_, l'évaluer puis la poser si elle vous convient. En mode _Triche_, vous avez accès au bouton _Question auto_ qui posera une question optimale.

L'action _Sauver la partie_ permet de télécharger le json de la partie actuelle, sauvegardant ainsi les persos retournés et le tour.

L'action _Abandonner_ fait gagner l'adversaire.

> Note : La déconnexion d'un joueur entraine sa disqualification immédiate !

En dessous des actions, vous retrouverez un tchat concernant l'_Historique_ des actions avec l'heure correspondante. Le tour et les questions que vous avez posé y seront écrites.

Lorsqu'un joueur a gagné, il sera affiché à l'écran chez les deux joueurs, et vous serez invité à revenir à l'accueil.

> Note : L'interface graphique du jeu est monopage, n'utilisez pas le bouton retour de votre navigateur pendant la partie !

### Magasin de plateaux

Sur cette page, vous trouverez différents plateaux de jeu sous format json réalisés par nos soins. Si un plateau vous intéresse, cliquez sur _Télécharger_ et lancez une partie !

> Note : Les plateaux sont stockés dans `quiestce/public/magasin/json/`.

### Générateur de plateaux (WIP)

Work in progress...

## Format du plateau json

Dans cette section nous verrons les spécificités du format json utilisé pour les plateaux.

Voici un extrait commenté d'un de nos json :

```js
{
  "Tour": "undefined", /* Le tour sera choisi aléatoirement entre J1 et J2 pour savoir qui commence */
  "J1": { /* Plateau du J1 */
    "personnage_cache": {
      "nom": "-1" /* Le personnage caché du J1 sera choisi aléatoirement */
    },
    "personnages": [ /* Une liste d'objets représentant les personnages */
      {
        "nom": "Léon", /* Le nom du personnage 1 */
        "visible": "true", /* Par défaut tous les personnages sont visibles */
        "img": "https://i.imgur.com/mNan2l3.png", /* Le lien vers l'image du personnage 1 */
        "attributs": [ /* Une liste d'objets représentant les attributs du personnage 1 */
          {
            "Cheveux": [
              "Blond",
              "Courts" /* Il peut y avoir plusieurs valeurs pour un même attribut */
            ]
          },
          {
            "Genre": [
              "Homme"
            ]
          },
          {
            "Lunettes": [
              "Oui",
              "Carrées",
              "Grande"
            ]
          },
          {
            "Couvre chef": [
              "Aucun"
            ]
          },
          {
            "Moustache": [
              "Aucune"
            ]
          },
          {
            "Barbe": [
              "Aucune"
            ]
          },
          {
            "Sourcils": [
              "Blond",
              "Fins"
            ]
          },
          {
            "Taille du nez": [
              "Petit"
            ]
          }
        ]
      },
      {
        "nom": "Simon", /* Le nom du personnage 2 */
        "visible": "true", /* Par défaut tous les personnages sont visibles */
        "img": "https://i.imgur.com/kKIb8nb.png", /* Le lien vers l'image du personnage 2 */
        "attributs": [
          {
            "Cheveux": [
              "Blanc",
              "Courts"
            ]
          },
          {
            "Genre": [
              "Homme"
            ]
          },
          {
            "Lunettes": [
              "Oui",
              "Petite",
              "Carées"
            ]
          },
          {
            "Couvre chef": [
              "Aucun"
            ]
          },
          {
            "Moustache": [
              "Aucune"
            ]
          },
          {
            "Barbe": [
              "Aucune"
            ]
          },
          {
            "Sourcils": [
              "Blanc",
              "Fins"
            ]
          },
          {
            "Taille du nez": [
              "Petit"
            ]
          }
        ]
      }
    ]
  },
  "J2": { /* Plateau du J2 */
    "personnage_cache": {
      "nom": "-1" /* Le personnage caché du J2 sera choisi aléatoirement */
    },
    "personnages": [ /* Une liste d'objets représentant les personnages */
      {
        "nom": "Léon", /* Le nom du personnage 1 */
        "visible": "true", /* Par défaut tous les personnages sont visibles */
        "img": "https://i.imgur.com/mNan2l3.png", /* Le lien vers l'image du personnage 1 */
        "attributs": [ /* Une liste d'objets représentant les attributs du personnage 1 */
          {
            "Cheveux": [
              "Blond",
              "Courts" /* Il peut y avoir plusieurs valeurs pour un même attribut */
            ]
          },
          {
            "Genre": [
              "Homme"
            ]
          },
          {
            "Lunettes": [
              "Oui",
              "Carrées",
              "Grande"
            ]
          },
          {
            "Couvre chef": [
              "Aucun"
            ]
          },
          {
            "Moustache": [
              "Aucune"
            ]
          },
          {
            "Barbe": [
              "Aucune"
            ]
          },
          {
            "Sourcils": [
              "Blond",
              "Fins"
            ]
          },
          {
            "Taille du nez": [
              "Petit"
            ]
          }
        ]
      },
      {
        "nom": "Simon", /* Le nom du personnage 2 */
        "visible": "true", /* Par défaut tous les personnages sont visibles */
        "img": "https://i.imgur.com/kKIb8nb.png", /* Le lien vers l'image du personnage 2 */
        "attributs": [
          {
            "Cheveux": [
              "Blanc",
              "Courts"
            ]
          },
          {
            "Genre": [
              "Homme"
            ]
          },
          {
            "Lunettes": [
              "Oui",
              "Petite",
              "Carées"
            ]
          },
          {
            "Couvre chef": [
              "Aucun"
            ]
          },
          {
            "Moustache": [
              "Aucune"
            ]
          },
          {
            "Barbe": [
              "Aucune"
            ]
          },
          {
            "Sourcils": [
              "Blanc",
              "Fins"
            ]
          },
          {
            "Taille du nez": [
              "Petit"
            ]
          }
        ]
      }
    ]
  }
}
```
