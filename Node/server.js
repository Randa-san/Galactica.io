const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const url = require('url');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Dbmongo = require('./public/script/classes/Mongo.class.js')// Classe requetes Mongo
const Dbsql = require('./public/script/classes/Sql.class.js')// Classe requetes Sql
let users = []; // Stock les joueurs dans le chat
const players = {}; // Stock les joueurs 
let nb_players = 0;

// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use("/lobby", express.static(__dirname + "/public"));

// ===========       PARTIE INITIALISATION DES CONNECTIONS ET DECONNECTIONS       ===========

// Enregistrement du membre dans la bdd mongo s'il n'éxiste pas
app.get('/lobby/:user', function(req,res){
    let checking_player = new Dbsql(req.params.user);
    checking_player.getLogged(checking_player.username, function(result){
      if(result === 'true'){
          let player = new Dbmongo(req.params.user);
          player.setUser(player.username);
          res.sendFile(__dirname + "/public/lobby.html");
      }
      else{
        res.redirect('http://localhost/Galactica.io/Apache/Public/');
      }  
    })
})

// Gestion de la déconnection des membres
app.use(bodyParser.urlencoded({ extended: true }));;
app.post('/logout', function(req,res){
  let player_logout = new Dbsql(req.body.playername);
  player_logout.setLogged(player_logout.username, function(result){
    res.send(result)
  });
});

// Gestion pour renvoyer les données du tableau de statistique joueur
app.use(bodyParser.urlencoded({ extends : true })); 
app.post('/getstats', function(req, res) {
  let player = req.body.name;
  let player_stats = new Dbmongo(player);
  player_stats.getStat(player, function(length){
    res.send(length)
  });
});

//Gestion de la suppression d'un joueur suite à un ban
app.use(bodyParser.urlencoded({ extends : true })); 
app.post('/setBan', function(req, res) {
  let player_name = req.body.name;
  let player = new Dbmongo(player_name);
  player.setBan(player_name);
});

// ===========       PARTIE SOCKET.IO CHAT      ===========

//Evenement à la connection du client sur le lobby
io.on('connection', function(socket){
    let user;
    // Emission de "user-login" pour chaque utilisateur connecté
    for (i = 0; i < users.length; i++) {
        socket.emit('user-login', users[i]);
      }
    // Réception de 'user-login'
    socket.on('user-login',function(loggedUser){
        user = loggedUser ;
        io.emit('connexion', user.username);
        //Evenement à la déconnection
        socket.on('disconnect',()=>{ 
            if (user !== undefined) {
                //Suppression de la liste des connectés
                let userIndex = users.indexOf(user);
                if (userIndex !== -1){
                    users.splice(userIndex, 1);
                }
                // Emission d'un 'user-logout' contenant le user
                io.emit('user-logout', user);
            }
        });
    });
  
    //Reception de l'evenement 'chat-message' et émission au client
    socket.on('chat-message', function (message) {
        message.username = user.username;
        io.emit('chat-message', message);
    });

    //Affichage en temps réel des utilisateurs connectés en les enregistrants dans un tableau
    socket.on('user-login', function (user, callback) {
        // Vérification que l'utilisateur n'existe pas déja dans le tableau
        let userIndex = -1;
        for (i = 0; i < users.length; i++) {
          if (users[i].username === user.username) {
            userIndex = i;
          }
        }
        if (user !== undefined && userIndex === -1) { // Si l'utilisateur est nouveau
          // Sauvegarde de l'utilisateur et ajout à la liste des connectés
          loggedUser = user;
          users.push(loggedUser);
          // Emission de 'user-login' et appel du callback
          io.emit('user-login', loggedUser);
          callback(true);
        }
        else {
          callback(false);
        }
      });


// ===========       PARTIE SOCKET.IO JEU      ===========

  let index = Math.floor(Math.random() * (4 - 0 + 1)); // Servira d'index et permettra au joueur d'invoquer un vaisseau du tableau avec un index aléatoire
  players[socket.id] = {}; // En attendant la réponse client, l'objet players sera vide
  //Quand un joueur appuie sur jouer, il incremente la variable nombre joueur, si c'est moins de 2 la partie s'ouvre, autrement un message est envoyé
  socket.on('play', function (data){
    if(nb_players <= 2){
      nb_players++;
      socket.emit('player', {playername: data, player: nb_players, index: index}) // On renseigne le numéro de joueur et le random d'invocation vaisseau
    }
    else{
      socket.emit('full game', data)
    }
  })
  // bullets[socket.id] = []; => Désactivés car les tirs sont gérés du côté client

  // Récupération des informations client et enregistrement des données du joueur
  // Détails => player: Numéro de joueur, x & y: Coordonnées du joueur, rotation: rotation du vaisseau, bx by & br: coordonnées des balles et angle de tir( Désactivés )
  socket.on('player_datas', function(list) {
    players[socket.id] = {player: list.player, x : list.x, y: list.y, rotation: 0, bx: 0, by: 0, br: 0};
    socket.emit('players list', Object.values(players));
  });
  
  socket.on('disconnect', function() {
    if(players[socket.id].player == 2){
      nb_players--;
    }
    if(players[socket.id].player == 1){
      nb_players = 0;
    }
    delete players[socket.id];
  });

  // //Gestion du déplacement à gauche
  socket.on('move left', function(list) { 
    players[socket.id].x = list.x
    socket.emit('players list', Object.values(players));
  })

  //Gestion du déplacement en haut
  socket.on('move up', function(list) {
    players[socket.id].y = list.y
    socket.emit('players list', Object.values(players));
  })

  //Gestion du déplacement à droite
  socket.on('move right', function(list) {
    players[socket.id].x = list.x
    socket.emit('players list', Object.values(players,));
  })

  //Gestion du déplacement à droite
  socket.on('move down', function(list) {
    players[socket.id].y = list.y;
    socket.emit('players list', Object.values(players));
  })

  //Gestion des rotations
  socket.on('ship rotation', function(rotation){
    players[socket.id].rotation = rotation;
    socket.emit('players list', Object.values(players));
  });

  //Gestion des balles
  socket.on('bullets',function(bullet){
    players[socket.id].bx = bullet.x
    players[socket.id].by = bullet.y
    players[socket.id].br = bullet.r
    socket.broadcast.emit('bulletShot', Object.values(players));
  });

  // Gestion des victoires
  socket.on('win',function(data){
    let player = new Dbmongo(data);
    player.setWon(player.username)
  });

  // Gestion des défaites
  socket.on('loose',function(data){
    let player = new Dbmongo(data);
    player.setLost(player.username)
  });
});

http.listen(3000);