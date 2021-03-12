<?php 
class Admin {
    //Fonction statique pour récuperer les utilisateurs enregistrés
    static function getUsers(){
        include 'logsql.php';
        try {
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = $conn->prepare("SELECT player, mail, logged FROM users");
            $query->execute();
            $result= $query ->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($result);
        }
        catch (PDOexception $e){
            echo "Erreur : ".$e->getMessage();
            die();
        }
    }

    //Fonction statique pour récuperer les utilisateurs bannis
    static function getBanned(){
        include 'logsql.php';
        try {
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = $conn->prepare("SELECT mail FROM banned");
            $query->execute();
            $result= $query ->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($result);
        }
        catch (PDOexception $e){
            echo "Erreur : ".$e->getMessage();
            die();
        }
    }

    //Fonction statique bannir un utilisateur
    static function setBan($m){
        include 'logsql.php';
        try {
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //Suppression de la table users
            $query = $conn->prepare("DELETE FROM users WHERE mail='".$m."'");
            $query->execute();
            //Ajout à la table banned
            $query2 = $conn->prepare("INSERT INTO banned (mail) VALUES ('".$m."')");
            $query2->execute();
        }
        catch (PDOexception $e){
            echo "Erreur : ".$e->getMessage();
            die();
        }
        $conn = null;
    }
}//Fin de la classe