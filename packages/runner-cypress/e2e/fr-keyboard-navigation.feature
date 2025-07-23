#language: fr
Fonctionnalité: Navigation au clavier

  Scénario: Focus on app logo
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/"
    Quand je commence une navigation au clavier depuis le haut de la page
    Alors le prochain élément avec le focus clavier doit être un lien nommé "Weather App's Logo"

  Scénario: Focus on app link
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/"
    Quand je commence une navigation au clavier depuis le haut de la page
    Alors le prochain élément avec le focus clavier doit être un lien nommé "Weather App's Logo"
    Et le prochain élément avec le focus clavier doit être un lien nommé "Home"

  Scénario: Focus on app link with back nav
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/"
    Quand je commence une navigation au clavier depuis le haut de la page
    Alors le prochain élément avec le focus clavier doit être un lien nommé "Weather App's Logo"
    Et le prochain élément avec le focus clavier doit être un lien nommé "Home"
    Et le prochain élément avec le focus clavier doit être un bouton nommé "Get started"
    Et le précédent élément avec le focus clavier doit être un lien nommé "Home"

  Scénario: Focus on Get Started button
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/"
    Quand je commence une navigation au clavier depuis le haut de la page
    Alors le prochain élément avec le focus clavier doit être un lien nommé "Weather App's Logo"
    Et le prochain élément avec le focus clavier doit être un lien nommé "Home"
    Et le prochain élément avec le focus clavier doit être un bouton nommé "Get started"

  Scénario: Verify new town form keyboard navigation
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
    Quand je clique sur le bouton nommé "Add new town"

    Alors je commence une navigation au clavier depuis le haut de la page
    Et le prochain élément avec le focus clavier doit être un lien nommé "Weather App's Logo"
    Et le prochain élément avec le focus clavier doit être un lien nommé "Home"
    Et le prochain élément avec le focus clavier doit être une boîte à texte nommée "Town name"
    Et le prochain élément avec le focus clavier doit être une liste déroulante nommée "Town type"
    Et le prochain élément avec le focus clavier doit être un bouton rotatif nommé "Latitude"
    Et le prochain élément avec le focus clavier doit être un bouton rotatif nommé "Longitude"
    Et le prochain élément avec le focus clavier doit être une boîte à texte nommée "Description"
    Et le prochain élément avec le focus clavier doit être un bouton radio nommé "Small (under 150000)"
    Et le prochain élément avec le focus clavier doit être une case à cocher nommée "Allow automatic update"
    Et le prochain élément avec le focus clavier doit être un bouton nommé "Back to town list"
    Et le prochain élément avec le focus clavier doit être un bouton nommé "Submit new town form"

  Scénario: Fill new town form with keyboard
    Etant donné que je visite l'Url "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
     Et je simule une requête GET sur l'url "https://e2e-test-quest.github.io/weather-app/data/mock.json" nommée "mock-new-town" avec le fichier suivant mock-new-town.json
     Et je simule une requête POST sur l'url "https://e2e-test-quest.github.io/weather-app/api" nommée "mock-post-new-town" avec le contenu suivant "Success"

    Quand je clique sur le bouton nommé "Add new town"
     Et je commence une navigation au clavier depuis le haut de la page
     Et le prochain élément avec le focus clavier doit être un lien nommé "Weather App's Logo"
     Et le prochain élément avec le focus clavier doit être un lien nommé "Home"

     Et le prochain élément avec le focus clavier doit être une boîte à texte nommée "Town name"
     Et je saisie les mots "Paris"

     Et le prochain élément avec le focus clavier doit être une liste déroulante nommée "Town type"
     Et je sélectionne la valeur "Real"

     Et le prochain élément avec le focus clavier doit être un bouton rotatif nommé "Latitude"
     Et je saisie les mots "10"

     Et le prochain élément avec le focus clavier doit être un bouton rotatif nommé "Longitude"
     Et je saisie les mots "123"

     Et le prochain élément avec le focus clavier doit être une boîte à texte nommée "Description"
     Et je saisie les mots "Simple Description"

     Et je vais au prochain élément au clavier
     Et je vais au prochain élément au clavier

     Et le prochain élément avec le focus clavier doit être un bouton nommé "Back to town list"
     Et le prochain élément avec le focus clavier doit être un bouton nommé "Submit new town form"

     Et je clique

    Alors je dois voir une liste nommée "Available Towns" et contenant
      | Douala  |
      | Tunis   |
      | Limoges |
      | Paris   |
