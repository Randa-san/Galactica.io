<?php
//Logs d'authentification bdd
$dbhost = 'localhost';
$dbname= '***';
$dbuser = '***';
$dbpass = '***';
$conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);