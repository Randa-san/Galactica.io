let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

class Dbmongo {
    username;

    //CONSTRUCTEUR
    constructor(u) {
        this.username = u;
    }

    // METHODE QUI VERIFIE SI LE JOUEURS EXISTE DANS LA BDD MONGO GRACE A SON PSEUDO //
    setUser(u){
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            let dbo = db.db("Sapoint_Galaxy");
            let query = {
                username: u
            };
            // SI LE JOUEUR N'EXISTE PAS INSERTION DU NOUVEAU JOUEUR DANS LA BDD AVEC LES STATS A 0 //
            dbo.collection("players").find(query).count(function (err, result){
                if(result === 0){
                    let myobj = {
                        username: u,
                        played: 0,
                        won: 0,
                        lost: 0,
                        stat: [0]
                    }
                    // Insertion du nouveau joueur (myobj) dans BDD Mongo
                    dbo.collection("players").insertOne(myobj, function (err, result) { 
                        if (err) throw err;
                        db.close();
                    });
                }
            });
        });
    }

    // METHODE QUI RECUPERE LE NOMBRE DE PARTIE JOUEES DU JOUEUR //
    getPlayed(u, callback) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("Sapoint_Galaxy");
            let query = {
                username: u
            };
            // Fait une recherche grace a la requete (query) et stock les ellement dans un tableau 
            dbo.collection("players").find(query).toArray(function(err, result) {
                // Precise l'element a recuperer dans le tableau "result" (.played => nombre de partie jouées dans BDD mongoDB)
                let played = result[0].played; 
                callback(played)
            })
        })
    }

    // METHODE QUI RECUPERE LE TABLEAU DE STAT DU JOUEUR //
    getStat(u, callback) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("Sapoint_Galaxy");
            let query = {
                username: u
            };
            let tab = []
            // Fait une recherche grace a la requete (query) et stock les ellement dans un tableau
            dbo.collection("players").find(query).toArray(function(err, result) {
                let stat = result[0].stat;
                callback(stat)
            })
        })
    }

    // METHODE QUI RECUPERE LE NOMBRE DE PARTIE GAGNEES DU JOUEUR //
    getWon(u, callback) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("Sapoint_Galaxy");
            let query = {
                username: u
            };
            // Fait une recherche grace a la requete (query) et stock les ellement dans un tableau
            dbo.collection("players").find(query).toArray(function(err, result) {
                // Precise l'element a recuperer dans le tableau "result" (.won => nombre de partie gagnées dans BDD mongoDB)
                let won = result[0].won;
                callback(won)
            })
        })
    }

    // METHODE QUI AJOUTE UN +1 AU NOMBRE DE PARTIE GAGNEES ET MET A JOUR LA BDD MONGO //
    setWon(u) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("Sapoint_Galaxy");
            let query = {
                username: u
            };
            // Fait une recherche grace a la requete (query) et stock les ellement dans un tableau
            dbo.collection("players").find(query).toArray(function(err, result) {
                // Precise l'element a recuperer dans le tableau "result" (.won => nombre de partie gagnées dans BDD mongoDB) et ajoute un +1
                let plusOne = parseInt(result[0].won + 1);
                let plusOnePlayed = parseInt(result[0].played + 1);
                // Met a jour la BDD Mongo en ajoutant le nouveau resultat et pousse un "W" dans le tableau stat
                dbo.collection("players").updateMany(query, { $set: { won: plusOne, played: plusOnePlayed }, $push: { stat: "W" }})
                })
            })
    }

    // METHODE QUI RECUPERE LE NOMBRE DE PARTIE PERDUES DU JOUEUR //
    getLost(u, callback) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("Sapoint_Galaxy");
            let query = {
                username: u
            };
            // Fait une recherche grace a la requete (query) et stock les ellement dans un tableau
            dbo.collection("players").find(query).toArray(function(err, result) {
                // Precise l'element a recuperer dans le tableau "result" (.lost => nombre de partie perdues dans BDD mongoDB)
                let lost = result[0].lost;
                callback(lost)
            })
        })
    }

    // METHODE QUI AJOUTE UN +1 AU NOMBRE DE PARTIE PERDUES ET MET A JOUR LA BDD MONGO //
    setLost(u) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("Sapoint_Galaxy");
            let query = {
                username: u
            };
            // Fait une recherche grace a la requete (query) et stock les ellement dans un tableau
            dbo.collection("players").find(query).toArray(function(err, result) {
                // Precise l'element a recuperer dans le tableau "result" (.lost => nombre de partie perdues dans BDD mongoDB) et ajoute un +1
                let plusOne = parseInt(result[0].lost + 1);
                let plusOnePlayed = parseInt(result[0].played + 1);
                // Met a jour la BDD Mongo en ajoutant le nouveau resultat et pousse un "L" dans le tableau stat
                dbo.collection("players").updateMany(query, { $set: { lost: plusOne, played: plusOnePlayed }, $push: { stat: "L" }})
                })
            })
    }

    // METHODE QUI SUPPRIME LE JOUEUR DE LA BDD MONGO //
    setBan(u) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("Sapoint_Galaxy");
            let query = {
                username: u
            };
            // Supprime de la BDD Mongo la ligne qui correspond a la requete (recherche par pseudo)
            dbo.collection("players").deleteOne(query, function(err, obj) {
                console.log(obj.deletedCount + " Joueur supprimé !")
            })
        })
    }
}
module.exports = Dbmongo;