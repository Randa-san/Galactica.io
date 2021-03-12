$( document ).ready(function() {
    $("#showUsers").hide();
    $("#showBanned").hide();
    $("#isBanned").text('');
    //Requête pour réceptionner un tableau des utilisateurs enregistrés
    $.post("PHP/get_user.php",
    function(data){
        $("#getUsers").click(function(){
            $("#showUsers").text('');
            showUsers(data);
        });
    })
    //Requête pour réceptionner un tableau des utilisateurs bannis
    $.post("PHP/get_banned.php",
    function(data){
        $("#getBanned").click(function(){
            $("#showBanned").text('');
            showBanned(data);
        });
    })
});

//Fonction qui traite la méthode post getUsers
function showUsers(data){
    $("#showUsers").toggle();
    //On parse les données récupérées de la base de données
    let dataUsers = JSON.parse(data);
    //Création de la table
    $("#showUsers").append("<table id='tableUsers'><th>Membres</th><th>E-mails</th><th>En ligne</th><th>Bannir</th>") 
    //Affichage des données dans la table
    jQuery.each(dataUsers, function(key, val){
        if(val.logged === "false"){
            val.logged = "🔴";
        }
        else{
            val.logged = "🟢";//Emoji Cercle vert
        }
        $("#tableUsers").append("<tr><td>"+val.player+"<td>"+val.mail+"<td>"+val.logged+"<td><button name='test' id='" + val.mail + "'  class='" + val.player + "'>Bannir");
    });
    //Bannir les utilisateurs
    $("button[name='test']").click(function() {
        let setBan = $(this).attr('id');
        let playerName = $(this).attr('class');
        $.post('PHP/set_ban.php',
        {
            Email : setBan
        });
        $.post('http://localhost:3000/setBan',
        {
            name : playerName
        });
        $("#isBanned").append("<p>" + setBan + " a été banni !</p>");
        setTimeout('reload()', 2000)
    })
}


//Fonction qui traite la méthode post getBanned
function showBanned(data){
    $("#showBanned").toggle();
    //On parse les données récupérées de la base de données
    let dataUsers = JSON.parse(data);
    //Création de la table
    $("#showBanned").append("<table id='tableBanned'><th>E-mails Bannis</th>") 
    //Affichage des données dans la table
    jQuery.each(dataUsers, function(key, val){
        $("#tableBanned").append("<tr><td>"+val.mail);
    });
}

//Fonction de déconnection
function reload() {
    document.location.href="http://localhost/Galactica.io/Apache/Administrateur/admin.html";
}