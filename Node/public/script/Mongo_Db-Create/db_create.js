var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var urlDB = "mongodb://localhost:27017/Sapoint_Galaxy"
MongoClient.connect(urlDB, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Sapoint_Galaxy");
    dbo.createCollection("players", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});