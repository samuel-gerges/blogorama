DROP DATABASE IF EXISTS projet_pw6;
CREATE DATABASE projet_pw6;

USE projet_pw6;

DROP TABLE IF EXISTS Utilisateur;
DROP TABLE IF EXISTS Abonnement;
DROP TABLE IF EXISTS Publication;

CREATE TABLE Utilisateur
(
    uid SERIAL PRIMARY KEY,
    pseudo VARCHAR(30) NOT NULL UNIQUE,
    email TEXT NOT NULL,
    mdp TEXT NOT NULL,
    photo TEXT NOT NULL,
    nb_abonnes INTEGER,
    nb_abonnements INTEGER

    -- CHECK(email LIKE '%@%.com' OR email LIKE '%@%.fr')
);

CREATE TABLE Publication
(
    pid SERIAL PRIMARY KEY,
    uid INTEGER,
    contenu TEXT,
    datep TIMESTAMP,
    nb_likes INTEGER,
    nb_dislikes INTEGER
);

CREATE TABLE LikeDislikeInfo
(
    pid INT,
    uid INT,
    lord VARCHAR(255)
 
);

CREATE TABLE Abonnement
(
    uid1 INTEGER,
    uid2 INTEGER
    /* Une instance (1, 2) de la table 'Abonnement' indique que l'utilisateur 1 est abonné à l'utilisateur 2 */
);

INSERT INTO Utilisateur
VALUES
    (1, 'Degorre', 'email@1.com', 'motdepasse1', 'images/photo-profil-defaut.jpg', 0, 0),
    (2, 'Habermehl', 'email@2.com', 'motdepasse2', 'images/photo-profil-defaut.jpg', 0, 0),
    (3, 'Padovani', 'email@3.com', 'motdepasse3', 'images/photo-profil-defaut.jpg', 0, 0);

INSERT INTO Publication
VALUES
    (1, 2, 'Bonjour a tous !', NOW(), 0, 0),
    (2, 2, 'Comment allez-vous ?', NOW(), 0, 0),
    (3, 3, 'Je me porte bien merci.', NOW(), 0, 0),
    (4, 2, '@everyone Bonsoir tout le monde', NOW(), 0, 0),
    (5, 1, '@everyone Il fait très beau aujourdhui !', NOW(), 0, 0);
    
INSERT INTO Abonnement
VALUES
    (1, 2),
    (2, 1),
    (3, 1),
    (1, 3);