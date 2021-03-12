<?php
require 'classes/users.class.php';
//Récuperation des variables du formulaire POST
$mail = $_POST['connect_mail'];
$password = $_POST['connect_password'];
//Récuperation username grâce à la méthode getUserName
$username = Users::getUserName($mail);
//Instanciation d'un nouveau joueur
$new_player = new Users($username, $mail, $password);
//Envoie de la réponse au client (compte existant ou non)
echo $new_player->userConnect($username,$password);