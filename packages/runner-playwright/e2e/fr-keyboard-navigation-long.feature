#language: fr
Fonctionnalité: Navigation au clavier - Longue

  Scénario: Focus on app logo
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/"
    Quand je commence une navigation au clavier depuis le haut de la page
    Alors je vais au prochain élément au clavier
    Et l'élément avec le rôle "link" et le nom "Weather App's Logo" doit avoir le focus clavier
    Et je dois voir un lien nommé "Weather App's Logo" avoir le focus clavier

  Scénario: Focus on app link
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/"
    Quand je commence une navigation au clavier depuis le haut de la page
    Et je vais au prochain élément au clavier
    Et je vais au prochain élément au clavier
    Alors l'élément avec le rôle "link" et le nom "Home" doit avoir le focus clavier
    Et je dois voir un lien nommé "Home" avoir le focus clavier

  Scénario: Focus on app link with back nav
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/"
    Quand je commence une navigation au clavier depuis le haut de la page
    Alors je vais au prochain élément au clavier
    Et je dois voir un lien nommé "Weather App's Logo" avoir le focus clavier
    Et je vais au prochain élément au clavier
    Et je dois voir un lien nommé "Home" avoir le focus clavier
    Et je vais au prochain élément au clavier
    Et je dois voir un bouton nommé "Get started" avoir le focus clavier
    Et je vais au précédent élément au clavier
    Et l'élément avec le rôle "link" et le nom "Home" doit avoir le focus clavier
    Et je dois voir un lien nommé "Home" avoir le focus clavier

  Scénario: Focus on Get Started button
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/"
    Quand je commence une navigation au clavier depuis le haut de la page
    Et je vais au prochain élément au clavier
    Et je dois voir un lien nommé "Weather App's Logo" avoir le focus clavier
    Et je vais au prochain élément au clavier
    Et je dois voir un lien nommé "Home" avoir le focus clavier
    Et je vais au prochain élément au clavier
    Alors je dois voir un bouton nommé "Get started" avoir le focus clavier

  Scénario: Verify new town form keyboard navigation
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
    Quand je clique sur le bouton nommé "Add new town"
    Et je commence une navigation au clavier depuis le haut de la page
    Et je vais au prochain élément au clavier

    Et je dois voir un lien nommé "Weather App's Logo" avoir le focus clavier
    Et je vais au prochain élément au clavier

    Et je dois voir un lien nommé "Home" avoir le focus clavier
    Et je vais au prochain élément au clavier

    Alors je dois voir une boîte à texte nommée "Town name" avoir le focus clavier
     Et je vais au prochain élément au clavier

     Et je dois voir une liste déroulante nommée "Town type" avoir le focus clavier
     Et je vais au prochain élément au clavier

     Et je dois voir un bouton rotatif nommé "Latitude" avoir le focus clavier
     Et je vais au prochain élément au clavier

     Et je dois voir un bouton rotatif nommé "Longitude" avoir le focus clavier
     Et je vais au prochain élément au clavier

     Et je dois voir une boîte à texte nommée "Description" avoir le focus clavier
     Et je vais au prochain élément au clavier

     Et je dois voir un bouton radio nommé "Small (under 150000)" avoir le focus clavier
     Et je vais au prochain élément au clavier

     Et je dois voir une case à cocher nommée "Allow automatic update" avoir le focus clavier
     Et je vais au prochain élément au clavier

     Et je dois voir un bouton nommé "Back to town list" avoir le focus clavier
     Et je vais au prochain élément au clavier

     Et je dois voir un bouton nommé "Submit new town form" avoir le focus clavier

  Scénario: Fill new town form with keyboard
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
     Et je simule une requête GET sur l'url "https://e2e-test-quest.github.io/weather-app/data/mock.json" nommée "mock-new-town" avec le fichier suivant mock-new-town.json
     Et je simule une requête POST sur l'url "https://e2e-test-quest.github.io/weather-app/api" nommée "mock-post-new-town" avec le contenu suivant "Success"

    Quand je clique sur le bouton nommé "Add new town"
     Et je commence une navigation au clavier depuis le haut de la page
     Et je vais au prochain élément au clavier
     Et je dois voir un lien nommé "Weather App's Logo" avoir le focus clavier
     Et je vais au prochain élément au clavier
     Et je dois voir un lien nommé "Home" avoir le focus clavier
     Et je vais au prochain élément au clavier

     Et je dois voir une boîte à texte nommée "Town name" avoir le focus clavier
     Et je saisie les mots "Paris"
     Et je vais au prochain élément au clavier

     Et je dois voir une liste déroulante nommée "Town type" avoir le focus clavier
     Et je saisie les mots "Real"
     Et je vais au prochain élément au clavier


     Et je dois voir un bouton rotatif nommé "Latitude" avoir le focus clavier
     Et je saisie les mots "10"
     Et je vais au prochain élément au clavier

     Et je dois voir un bouton rotatif nommé "Longitude" avoir le focus clavier
     Et je saisie les mots "123"
     Et je vais au prochain élément au clavier

     Et l'élément avec le sélecteur "#new-town-description" doit avoir le focus clavier
     Et je saisie les mots "Simple Description"
     Et je vais au prochain élément au clavier
     
     Et je vais au prochain élément au clavier
     Et je vais au prochain élément au clavier

     Et je dois voir un bouton nommé "Back to town list" avoir le focus clavier
     Et je vais au prochain élément au clavier
     Et je dois voir un bouton nommé "Submit new town form" avoir le focus clavier
     Et je clique

    Alors je dois voir une liste nommée "Available Towns" et contenant
      | Douala  |
      | Tunis   |
      | Limoges |
      | Paris   |
