<?php
class Users{
    private $username;
    private $mail;
    private $password;

    //Fonction constructrice
    public function __construct($u, $m, $p){
        $this->username = $u;
        $this->mail = $m;
        $this->password = $p;
    }

    //Fonction pour retourner le nom d'utilisateur
    public function getName(){
        return $this->username;
    }

    //Fonction pour retourner le mail
    public function getMail(){
        return $this->mail;
    }

    //Fonction pour retourner le mot de passe
    public function getPassword(){
        return $this->password;
    }

    // Fonction pour vérifier si un utilisateur existe déjà dans la base de données
    public function checkUserName(){
        include 'logsql.php';
        try {
            $query = $conn->prepare("SELECT player FROM users");
            $query->execute();
            while($result = $query->fetch(PDO::FETCH_ASSOC)){//Requête de vérification si un player existe déjà
                if($result["player"] == SELF::getName()){
                    return "created";
                    die();
                }
            }
        }
        catch (PDOException $e) {
            echo "Error : " . $e->getMessage() . "<br>";//Gestionnaire d'erreurs PHP-PDO
            die();
        }
        return true;
    }

    //Fonction verification mail existant ou banni
    public function checkUserMail(){
        include 'logsql.php';
        try {
            $query = $conn->prepare("SELECT mail FROM banned");
            $query->execute();
            while($result = $query->fetch(PDO::FETCH_ASSOC)){//Requête de vérification si un mail a déja été banni
                if($result["mail"] == SELF::getMail()){
                    return "banned";
                    die();
                }
            }
            $query2 = $conn->prepare("SELECT mail FROM users");
            $query2->execute();
            while($result2 = $query2->fetch(PDO::FETCH_ASSOC)){//Requête de vérification si un mail existe déjà dans la bdd
                if($result2["mail"] == SELF::getMail()){
                    return "registered";
                    die();
                }
            }
        }
        catch (PDOException $e) {
            echo "Error : " . $e->getMessage() . "<br>";//Gestionnaire d'erreurs PHP-PDO
            die();
        }
        return true;
    }

    //Fonction pour enregistrer un client dans la base de données
    public function setUser(){
        include 'logsql.php';
        $password = password_hash(SELF::getPassword(), PASSWORD_DEFAULT);
        if(SELF::checkUserMail() === "banned"){//Verification du return mail banni de la méthode checkUserMail()
            return "banned";
        }
        elseif(SELF::checkUserMail() === "registered"){//Verification du return mail existant de la méthode checkUserMail()
            return "registered";
        }
        elseif(SELF::checkUserName() === "created"){//Verification du return user existant de la méthode checkUserName()
            return "created";
        }
        else{//Insertion des données utilisateur
            try {
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sth = $conn->prepare("INSERT INTO users(player,mail,password, logged) VALUES (?, ?, ?, ?)");
                $sth->execute(array(SELF::getName(), SELF::getMail(), $password, "true"));
                return "<b>Nouveau client ajouté</b>";   
            }
            catch (PDOException $e) {
                echo "Error : " . $e->getMessage() . "<br>";
                die();
            }
        }
    }

    //Fonction static pour récupérer un username grâce au mail et vérifier si le mail existe
    static function getUserName($m){
        include 'logsql.php';
        try {
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = $conn->prepare("SELECT player FROM users WHERE mail='".$m."'");
            $query->execute();
            $result= $query ->fetchAll(PDO::FETCH_ASSOC);
            if(empty($result)){//Si le resutat est vide, alors le mail renseigné n'existe pas dans la base de données.
                return '0';
            }
            else{//Le mail existe, donc renvoie le nom d'utilisateur
                foreach($result as $key => $value){
                    foreach($value as $datas){
                        return $datas;   
                    }
                }
            } 
        }
        catch (PDOException $e) {
            echo "Error : " . $e->getMessage() . "<br>";
            die();
        }
    } 

    //Fonction de vérification du formulaire de connection
    function userConnect($u,$p){
        include 'logsql.php';
        if($u === "0"){
            return "0";
        }
        else{
            try {
                $query = $conn->prepare("SELECT password FROM users WHERE player='".$u."'");
                $query->execute();
                while($result = $query->fetch(PDO::FETCH_ASSOC)){//Requête de vérification si un mail a déja été banni
                    if(password_verify($p, $result["password"])){
                        SELF::setLoggedTrue($u);
                        return $u;
                    }
                    else{
                        return '0';
                        die();
                    }
                }
            }
            catch (PDOException $e) {
                echo "Error : " . $e->getMessage() . "<br>";//Gestionnaire d'erreurs PHP-PDO
                die();
            }
        } 
    }
    
    //Fonction pour update la colonne logged pour signaler que la connection a été éffectuée
    function setLoggedTrue($u){
        include 'logsql.php';
        try{
            $query = $conn->prepare("UPDATE users SET logged = 'true' WHERE player ='".$u."'");
            $query->execute();
        }
        catch (PDOException $e) {
            echo "Error : " . $e->getMessage() . "<br>";//Gestionnaire d'erreurs PHP-PDO
            die();
        }
    }


}//Fin classe User