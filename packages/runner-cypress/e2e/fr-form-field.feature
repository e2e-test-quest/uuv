#language: fr
Fonctionnalité: Champ de formulaire

  Contexte:
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
    Et je clique sur le bouton nommé "Add new town"

  Scénario: select a value in combo box then check
    Quand je sélectionne la valeur "Unreal" dans la liste déroulante nommée "Town type"
    Alors je dois voir une liste déroulante nommée "Town type" avec la valeur "Unreal"

  Scénario: Set a input text value then check
    Quand j'entre la valeur "Azerty" dans la boîte à texte nommée "Town name"
    Alors je dois voir une boîte à texte nommée "Town name" avec la valeur "Azerty"

  Scénario: Set a input number value then check
    Quand j'entre la valeur "10" dans le bouton rotatif nommé "Latitude"
    Alors je dois voir un bouton rotatif nommé "Latitude" avec la valeur "10"