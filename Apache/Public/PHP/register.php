<?php
require 'classes/users.class.php';
//Récuperation des variables du formulaire POST
$user = $_POST['create_user'];
$mail = $_POST['create_mail'];
$password = $_POST['create_password'];
//Instanciation d'un nouveau joueur
$new_player = new Users($user, $mail, $password);
//Envoie de la réponse au client
echo $new_player->setUser();