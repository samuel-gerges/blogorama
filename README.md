Le but de ce projet est de réaliser un site de micro-blogage inspiré de Twitter ou de Mastodon.

# Auteurs

Gerges Samuel

Jami Adam

# Architecture et fichiers

Notre projet est composé des fichiers et dossier suivants :
- `bd_projet.sql` qui est un script d'initialisation de la base de données. Il va créer les tables nécessaires au bon fonctionnement du blog et les remplir avec quelques données.
- `main.js` qui crée la connexion avec la base de données et lance le serveur sur lequel tournera le site (sur le port `8080`).
- `index.html` qui va définir les différents éléments de la page, le front-end. Il est lié à `indexVue.js` pour faciliter le lien entre front-end et back-end et `index.css` pour le style.
- `indexVue.js` (se trouvant dans le dossier `script`) qui définit un composant pour les publications du blog et une instance de `Vue` qui va alors gérer le front-end du site et communiquer avec le back-end pour obtenir des informations.
`index.css` (se trouvant dans le dossier `css`) qui définit le style de la page web.
`indexQ.js` (se trouvant dans le dossier `script`) qui est lié à `index.html` et qui va rajouter des animations sur la page en utilisant la bibliothèque `jquery`.
- un dossier `images` contenant des images (avatars, logos).

Le front-end communique avec le back-end essentiellement grâce à des requêtes `GET`, `POST`, `PUT`, `DELETE` vers des routes qui sont alors gérées dans le fichier `main.js` et qui vont modifier des variables déclarées dans la `Vue`.

# Exécution du projet

Pour lancer le projet il faudra d'abord que vous exécutiez le script `bd_projet.sql` de création de la base de données avec `mysql` qui créera des utilisateurs, des publications et des abonnements. Ensuite il vous faudra changer les lignes X et Y du fichier `main.js`, dans lesquelles vous devrez supprimer 'root' et '' et mettre votre nom d'utilisateur et votre mot de passe `mysql`. Par la suite, il vous suffit de taper `node main.js` pour lancer le serveur, puis vous rendre dans votre navigateur à l'adresse `localhost:8080`. Vous serez alors sur la page d'accueil du site puis vous pourrez vous connecter avec l'un des comptes déjà créé :

* Degorre / motdepasse1
* Habermehl / motdepasse2
* Padovani / motdepasse3

ou vous créer un compte. Une fois connecté, vous aurez accès à plus de fonctionnalités : personnaliser l'affichage des publications, rechercher des publications selon un pseudo ou selon un hashtag.

# Parties implémentées et bugs

Nous avons implémenté l'intégralité du sujet minimal (sans compter les *liens pour éventuelles fonctionnalités supplémentaires (répondre en mentionnant l’auteur,« retweeter », s’abonner au ux de l’auteur...)*).

Nous tenions à vous signaler la présence de certains bugs, que nous n'avons malheureusement pas eu le temps de corriger, afin que vous ne soyez pas pertubé par ces derniers lors de vos tests :

- la mise à jour de la photo de profil ne prend effet qu'après avoir rechargé la page
- la gestion des abonnements présente des bugs
