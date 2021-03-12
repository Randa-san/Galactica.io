// Au chargement de la page
$(document).ready(function() {
    $("#creation").hide();
});

// Affichage du formulaire d'inscription et disparition du formulaire de connection
$("#register").click(function(){
    $("#connection").hide();
    $("#creation").show();
});

//Vérification du formulaire d'inscription
$("#form_register").submit(function(event){
    $(".alert").remove();
    let username = $("#create_user").val();
    let mail = $("#create_mail").val();
    let password = $("#create_password").val();
    let password1 = $("#create_password1").val();
    if(password === password1){
    $(".alert").remove();
    $.post('PHP/register.php',
        {create_user: username, create_mail: mail,create_password: password},
        function(data){
            if (data === 'banned'){
                $("#create_button").after("<br class='alert'><br class='alert'><span class='alert'>Cet E-mail a été banni</span>");
            }
            else if(data === 'registered'){
                $("#create_button").after("<br class='alert'><br class='alert'><span class='alert'>Cet E-mail existe déjà</span>");
            }
            else if(data === 'created'){
                $("#create_button").after("<br class='alert'><br class='alert'><span class='alert'>Utilisateur déjà enregistré</span>");  
            }
            else{
                document.location.href="http://localhost:3000/lobby/"+username;
            }
        });
    } else {
        $("#create_button").after("<br class='alert'><br class='alert'><span class='alert'>Vérifier votre mot de passe</span>");
    }
    event.preventDefault();
});

// Vérification du formulaire de connection
$("#form_connect").submit(function(event){
    let mail = $("#connect_mail").val();
    let password = $("#connect_password").val();
    $(".alert").remove();
    //Condition de vérification du remplissage des formulaires
    if($("#connect_mail").val().length === 0 && $("#connect_password").val().length === 0){
        $("#connect_mail").after("<br class='alert'><span class='alert'>Merci de remplir ce champ</span>");
        $("#connect_password").after("<br class='alert'><span class='alert'>Merci de remplir ce champ</span>");
        event.preventDefault();
    }
    else if($("#connect_mail").val().length === 0 ){
        $("#connect_mail").after("<br class='alert'><span class='alert'>Merci de remplir ce champ</span>");
        event.preventDefault();
    }
    else if($("#connect_password").val().length === 0){
        $("#connect_password").after("<br class='alert'><span class='alert'>Merci de remplir ce champ</span>");
        event.preventDefault();
    }
    else{
        $.post('PHP/login.php',
        {connect_mail: mail, connect_password: password},
        function(data){
            if (data === '0'){
                $("#connect_button").after("<br class='alert'><br class='alert'><span class='alert'>Identifiants incorrects</span>");
                
            }
            else{
                document.location.href="http://localhost:3000/lobby/"+data;
            }
        });
        event.preventDefault();
    }
});