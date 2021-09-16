const express = require('express');
var mysql = require('mysql');

const server = express();

var bodyParser = require('body-parser');
const session = require('express-session');
const { name } = require('ejs');

server.use(express.json());
server.use(express.urlencoded({
    extended: true
}));

server.set('view engine', 'ejs');

server.use(express.static(__dirname));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projet_pw6'
});

connection.on('error', function(err) {
    console.log("[mysql error]", err);
});

server.post('/register', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    connection.query("SELECT * FROM Utilisateur", function(error, results, fields) {
        /* Ici, on regarde si le pseudo ou l'email de l'utilisateur souhaitant s'inscrire sont déjà utilisés. */

        if (error) throw error;

        for (let i = 0; i < results.length; i++) {
            if (results[i]['pseudo'] == req.body.username) {
                res.end("PseudoE");
                return;
            } else if (results[i]['email'] == req.body.email) {
                res.end("EmailE");
                return;
            }
        }
        connection.query(`INSERT INTO Utilisateur (pseudo, email, mdp, photo, nb_abonnes, nb_abonnements) VALUES ('${req.body.username}', '${req.body.email}', '${req.body.password}', 'images/photo-profil-défaut.jpg', 0, 0)`, function(error, results, fields) {
            /* On insère les données de l'utilisateur dans la bd */

            if (error) throw error;
            res.end("L'ajout de l'utilisateur s'est bien passé.");
        });
    });
});

server.post('/connect', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    connection.query("SELECT * FROM Utilisateur", function(err, rows, fields) {
        if (err) throw err;
        for (i = 0; i < rows.length; i++) {
            isValidName = false;
            isValidPwd = false;

            if (req.body.username == rows[i]['pseudo']) {
                isValidName = true;
            }
            if (req.body.password == rows[i]['mdp']) {
                isValidPwd = true;
            }
            if (isValidName && isValidPwd) {
                res.end(req.body.username);
                currentNameEmploye = req.body['name'];
                connected = true;
                break;
            }
        }
        if (!(isValidName && isValidPwd)) {
            res.statusCode = 400;
            res.end("L'utilisateur ou le mot de passe entré ne correspond pas à un compte enregistré");
        }
    });
});

server.put('/all_posts', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var posts = [];
    connection.query("SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid)", function(err, rows, fields) {
        if (err) throw err;

        posts = rows.reverse();
        var postsAndNames = JSON.stringify(posts);

        res.end(postsAndNames);
    });
});



function arraysUnion(array1, array2) {
    var res = array1.concat(array2);

    for (var i = 0; i < res.length; i++) {
        for (var j = i + 1; j < res.length; j++) {
            if (res[i].pid == res[j].pid) {
                res.splice(j, 1);
                j--;
            }
        }
    }
    return res;
}

server.put('/mentions', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var posts = [];
    var postsAndNames;

    connection.query(`SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE contenu LIKE '%@${req.body.username}%'`, function(err, rows, fields) {
        if (err) throw err;

        if (req.body.posts != []) {
            posts = arraysUnion(req.body.posts, rows.reverse());
            posts.sort(function(a, b) {
                if (a.pid > b.pid) {
                    return -1;
                }
                return 0;
            });

            postsAndNames = JSON.stringify(posts);
        } else {
            posts = rows.reverse();
            postsAndNames = JSON.stringify(posts);
        }

        res.end(postsAndNames);
    });
});

server.delete('/mentions', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var posts = req.body.posts;
    var postsToDelete = [];

    connection.query(`SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE contenu LIKE '%@${req.body.username}%'`, function(err, rows, fields) {
        if (err) throw err;

        postsToDelete = rows;

        for (let i = 0; i < postsToDelete.length; i++) {
            for (let j = 0; j < posts.length; j++) {
                if (postsToDelete[i].pid == posts[j].pid) {
                    posts.splice(j, 1);
                }
            }
        }
        var postsAndNames = JSON.stringify(posts);

        res.end(postsAndNames);
    });
});

server.put('/everyone', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var posts = [];
    var postsAndNames;

    connection.query("SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE contenu LIKE '%@everyone%'", function(err, rows, fields) {
        if (err) throw err;

        if (req.body.posts != []) {
            posts = arraysUnion(req.body.posts, rows.reverse());
            posts.sort(function(a, b) {
                if (a.pid > b.pid) {
                    return -1;
                }
                return 0;
            });

            postsAndNames = JSON.stringify(posts);
        } else {
            posts = rows.reverse();
            postsAndNames = JSON.stringify(posts);
        }

        res.end(postsAndNames);
    });
});

server.delete('/everyone', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var posts = req.body.posts;
    var postsToDelete = [];
    connection.query("SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE contenu LIKE '%@everyone%'", function(err, rows, fields) {
        if (err) throw err;

        postsToDelete = rows;

        for (let i = 0; i < postsToDelete.length; i++) {
            for (let j = 0; j < posts.length; j++) {
                if (postsToDelete[i].pid == posts[j].pid) {
                    posts.splice(j, 1);
                }
            }
        }
        var postsAndNames = JSON.stringify(posts);

        res.end(postsAndNames);
    });
});

server.put('/following', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var posts = [];

    if (!req.body.everyone && req.body.mentions) {
        connection.query(`SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE pid IN (SELECT pid FROM Publication WHERE uid IN (SELECT uid2 FROM Abonnement JOIN Utilisateur ON (Abonnement.uid1 = Utilisateur.uid AND Utilisateur.pseudo = '${req.body.username}'))) AND contenu NOT LIKE '%@everyone%'`, function(err, rows, fields) {
            if (err) throw err;
            if (req.body.posts != []) {
                posts = arraysUnion(req.body.posts, rows.reverse());
                posts.sort(function(a, b) {
                    if (a.pid > b.pid) {
                        return -1;
                    }
                    return 0;
                });

                var postsAndNames = JSON.stringify(posts);
            } else {
                posts = rows.reverse();
                postsAndNames = JSON.stringify(posts);
            }
            res.end(postsAndNames);
        });
    } else if (req.body.everyone && !req.body.mentions) {
        connection.query(`SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE pid IN (SELECT pid FROM Publication WHERE uid IN (SELECT uid2 FROM Abonnement JOIN Utilisateur ON (Abonnement.uid1 = Utilisateur.uid AND Utilisateur.pseudo = '${req.body.username}'))) AND contenu NOT LIKE '%@${req.body.username}%'`, function(err, rows, fields) {
            if (err) throw err;
            if (req.body.posts != []) {
                posts = arraysUnion(req.body.posts, rows.reverse());
                posts.sort(function(a, b) {
                    if (a.pid > b.pid) {
                        return -1;
                    }
                    return 0;
                });

                var postsAndNames = JSON.stringify(posts);
            } else {
                posts = rows.reverse();
                postsAndNames = JSON.stringify(posts);
            }

            res.end(postsAndNames);
        });
    } else if (!req.body.everyone && !req.body.mentions) {
        connection.query(`SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE pid IN (SELECT pid FROM Publication WHERE uid IN (SELECT uid2 FROM Abonnement JOIN Utilisateur ON (Abonnement.uid1 = Utilisateur.uid AND Utilisateur.pseudo = '${req.body.username}'))) AND contenu NOT LIKE '%@everyone%' AND contenu NOT LIKE '%@${req.body.username}%'`, function(err, rows, fields) {
            if (err) throw err;

            if (req.body.posts != []) {
                posts = arraysUnion(req.body.posts, rows.reverse());
                posts.sort(function(a, b) {
                    if (a.pid > b.pid) {
                        return -1;
                    }
                    return 0;
                });

                var postsAndNames = JSON.stringify(posts);
            } else {
                posts = rows.reverse();
                postsAndNames = JSON.stringify(posts);
            }

            res.end(postsAndNames);
        });
    } else {
        connection.query(`SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE pid IN (SELECT pid FROM Publication WHERE uid IN (SELECT uid2 FROM Abonnement JOIN Utilisateur ON (Abonnement.uid1 = Utilisateur.uid AND Utilisateur.pseudo = '${req.body.username}')))`, function(err, rows, fields) {
            if (err) throw err;

            if (req.body.posts != []) {
                posts = arraysUnion(req.body.posts, rows.reverse());
                posts.sort(function(a, b) {
                    if (a.pid > b.pid) {
                        return -1;
                    }
                    return 0;
                });

                var postsAndNames = JSON.stringify(posts);
            } else {
                posts = rows.reverse();
                postsAndNames = JSON.stringify(posts);
            }

            res.end(postsAndNames);
        });
    }
});

server.delete('/following', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var posts = req.body.posts;
    var postsToDelete = [];
    connection.query(`SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE pid IN (SELECT pid FROM Publication WHERE uid IN (SELECT uid2 FROM Abonnement JOIN Utilisateur ON (Abonnement.uid1 = Utilisateur.uid AND Utilisateur.pseudo = '${req.body.username}')))`, function(err, rows, fields) {
        if (err) throw err;

        postsToDelete = rows;

        for (let i = 0; i < postsToDelete.length; i++) {
            for (let j = 0; j < posts.length; j++) {
                if (postsToDelete[i].pid == posts[j].pid) {
                    posts.splice(j, 1);
                }
            }
        }
        var postsAndNames = JSON.stringify(posts);

        res.end(postsAndNames);
    });
});

server.post('/tablord', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    connection.query(`SELECT * FROM Utilisateur WHERE pseudo = '${req.body.username}'`, function(error, results, fields) {


        var uid;
        var tab = [];
        var postsAndNames;

        if (error) throw error;


        uid = results[0]['uid'];

        connection.query(`SELECT * FROM LikeDislikeInfo WHERE uid = '${uid}'`, function(error, results, fields) {
            if (error) throw error;


            for (let i = 0; i < results.length; i++) {
                tab.push(results[i]['pid']);
                postsAndNames = JSON.stringify(tab);

            }
            res.end(postsAndNames);
            return;

        });

    });


});

server.post('/removeinfo', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var uid;

    connection.query(`SELECT * FROM Utilisateur WHERE pseudo = '${req.body.username}'`, function(error, results, fields) {
        if (error) throw error;


        uid = results[0]['uid'];


        connection.query(`DELETE FROM LikeDislikeInfo WHERE pid = ${req.body.pidpubli} AND uid = ${uid}`, function(error, results, fields) {

            if (error) throw error;
        });


    });

    res.end("suppression reussi");

});

server.post('/addinfo', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var uid;

    connection.query(`SELECT * FROM Utilisateur WHERE pseudo = '${req.body.username}'`, function(error, results, fields) {
        if (error) throw error;


        uid = results[0]['uid'];

        connection.query(`DELETE FROM LikeDislikeInfo WHERE pid = ${req.body.pidpubli} AND uid = ${uid}`, function(error, results, fields) {

            if (error) throw error;
        });

        connection.query(`INSERT INTO LikeDislikeInfo VALUES (${req.body.pidpubli}, ${uid},'${req.body.lordvalue}')`, function(error, results, fields) {

            if (error) throw error;

        });


    });

    res.end("reussi");

});

server.post('/add', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    var uid;

    connection.query(`SELECT uid FROM Utilisateur WHERE pseudo = '${req.body.username}'`, function(error, results, fields) {
        /* 
         * On cherche l'id correspondant à l'utilisateur qui a publié
         * Ici, on a la garantie que la requête ne retournera qu'un seul résultat car l'attribut 'pseudo' est UNIQUE
         */

        if (error) throw error;

        uid = results[0]['uid'];

        if (uid != []) {
            connection.query(`INSERT INTO Publication (uid, contenu, datep, nb_likes, nb_dislikes) VALUES (${uid}, '${req.body.message}', '${req.body.date}', 0, 0)`, function(error, results, fields) {
                /* On insère les données de la publication dans la bd */

                if (error) throw error;
            });
        }
    });
});

server.put('/addlike', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var likes = 0;
    var pid = req.body.pid;

    connection.query(`SELECT nb_likes FROM Publication WHERE pid = ${pid}`, function(error, results, fields) {
        if (error) throw error;

        likes = results[0]['nb_likes'];

        connection.query(`UPDATE Publication SET nb_likes = ${likes + 1} WHERE pid = ${pid}`, function(err, rows, fields) {
            if (err) throw err;

            res.end("Like ajouté !");
        });
    });
});


server.put('/adddislike', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var dislikes = 0;
    var pid = req.body.pid;

    connection.query(`SELECT nb_dislikes FROM Publication WHERE pid = ${pid}`, function(error, results, fields) {
        if (error) throw error;

        dislikes = results[0]['nb_dislikes'];

        connection.query(`UPDATE Publication SET nb_dislikes = ${dislikes + 1} WHERE pid = ${pid}`, function(err, rows, fields) {
            if (err) throw err;

            res.end("Dislike ajouté !");
        });
    });
});


server.put('/removelike', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var likes = 0;
    var pid = req.body.pid;

    connection.query(`SELECT nb_likes FROM Publication WHERE pid = ${pid}`, function(error, results) {
        if (error) throw error;

        likes = results[0]['nb_likes'];

        if (likes > 0) {
            connection.query(`UPDATE Publication SET nb_likes = ${likes - 1} WHERE pid = ${pid}`, function(err, rows, fields) {
                if (err) throw err;

                res.end("Like retiré !");
            });
        }
    });
});


server.put('/removedislike', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var dislikes = 0;
    var pid = req.body.pid;

    connection.query(`SELECT nb_dislikes FROM Publication WHERE pid = ${pid}`, function(error, results, fields) {
        if (error) throw error;

        dislikes = results[0]['nb_dislikes'];

        if (dislikes > 0) {
            connection.query(`UPDATE Publication SET nb_dislikes = ${dislikes - 1} WHERE pid = ${pid}`, function(err, rows, fields) {
                if (err) throw err;

                res.end("Dislike retiré !");
            });
        }
    });
});

server.post('/pdpp', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    var uid;


    connection.query(`SELECT photo FROM Utilisateur WHERE pseudo = '${req.body.username}' `, function(error, results, fields) {
        if (error) throw error;
        res.end(results[0]['photo']);
    });
});

server.post('/pdp', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    var uid;

    connection.query(`SELECT uid FROM Publication WHERE pid = '${req.body.pid}' `, function(error, results, fields) {

        if (error) throw error;

        uid = results[0]['uid'];

        connection.query(`SELECT photo FROM Utilisateur WHERE uid ='${uid}'`, function(error, results, fields) {

            if (error) throw error;
            res.end(results[0]['photo']);

        });



    });


});

server.post('/pdp2', function(req, res) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')


    connection.query(`UPDATE Utilisateur SET photo = '${req.body.pdpsrc}' WHERE pseudo='${req.body.username}'`, function(error, results, fields) {

        if (error) throw error;
        res.end("modifsuccess");

    });


});


server.post('/edit', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    connection.query("SELECT * FROM Utilisateur", function(error, results, fields) {

        if (error) throw error;

        for (let i = 0; i < results.length; i++) {
            if (results[i]['pseudo'] == req.body.username) {
                res.end("PseudoE");
                return;
            }
        }

        connection.query(`UPDATE Utilisateur SET pseudo ='${req.body.username}' , mdp ='${req.body.password}' WHERE pseudo='${req.body.currentusername}'`, function(error, results, fields) {

            if (error) throw error;
            res.end("modifsuccess");

        });
    });
});

server.put('/search1', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var posts = [];
    var postsAndNames;

    connection.query(`SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE pseudo = '${req.body.username}'`, function(err, rows, fields) {
        if (err) throw err;
        posts = rows.reverse();
        postsAndNames = JSON.stringify(posts);

        res.end(postsAndNames);
    });
});

server.put('/search2', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    var posts = [];
    var postsAndNames;

    connection.query(`SELECT * FROM Publication JOIN Utilisateur ON (Publication.uid = Utilisateur.uid) WHERE contenu LIKE '%${req.body.hashtag}%'`, function(err, rows, fields) {
        if (err) throw err;
        posts = rows.reverse();
        postsAndNames = JSON.stringify(posts);

        res.end(postsAndNames);
    });
});

server.put('/abonnement', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    var uid;

    connection.query(`SELECT uid FROM Utilisateur WHERE pseudo = '${req.body.username}'`, function(err, rows, fields) {
        if (err) throw err;

        uid = rows[0]['uid'];

        connection.query(`INSERT INTO Abonnement VALUES (${uid}, ${req.body.toFollow})`, function(error, results, fields) {

            if (error) throw error;
        });
    });
});

server.put('/desabonnement', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    var uid;

    connection.query(`SELECT uid FROM Utilisateur WHERE pseudo = '${req.body.username}'`, function(err, rows, fields) {
        if (err) throw err;

        uid = rows[0]['uid'];

        connection.query(`DELETE FROM Abonnement WHERE uid1 = ${uid} AND uid2 = ${req.body.toUnfollow}`, function(error, results, fields) {

            if (error) throw error;
        });
    });
});

server.listen(8080);