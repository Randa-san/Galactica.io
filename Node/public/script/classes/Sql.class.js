const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "***",
  password: "***",
  database: "****",
});

con.connect(function (err) {
  if (err) throw err;
});

class Dbsql {
  uername;

  constructor(u) {
    this.username = u;
  }

  //Méthode qui récupère la valeur de la colonne logged
  getLogged(u, callback) {
    con.query(
      "SELECT logged FROM users WHERE player = '" + u + "'",
      function (err, result, fields) {
        if (err) throw err;
        if (result.length === 0) {
          return callback("false");
        } else {
          return callback(result[0].logged);
        }
      }
    );
  }

  setLogged(u, callback) {
    con.query(
      "UPDATE users SET logged = 'false' WHERE player = '" + u + "'",
      function (err, result) {
        if (err) throw err;
        if (result.affectedRows === 1) {
          return callback("true");
        } else {
          return callback("false");
        }
      }
    );
  }
} //Fin de la classe

module.exports = Dbsql;
