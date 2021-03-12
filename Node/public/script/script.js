//Initialisation du socket
let socket = io();

//On recupere le nom utilisateur de l'URL et on le renseigne au serveur
$(document).ready(()=>{
    
    // Cache le canvas
    $(".plateau2").hide();

    //Récupération de l'utilisateur passé dans l'Url
    let get_url = document.location.href.split("/");
    let get_player = get_url[get_url.length - 1];
    let user = {
        username: get_player
    };

    // Quand le joueur appuie sur jouer
    $("#play").click(function(){
        socket.emit('play', user.username)
    })

    // Le serveur nous renseigne si la salle est pleine
    socket.on('full game', function(data){
        $(".plateau").append('<p id="full">Salle pleine');
    })

    //Vérification s'il y a un utilisateur
    if(get_player.length > 0){
        socket.emit('user-login', user, function(succes){
            if(succes){
                $('#chat input').focus();
            }
        });
    }

    //Initialisation de l'heure
    const locale = "fr-FR";
    let time;
    let options = {
        timeZone: "Europe/Paris",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    };
    
    //Formulaire du tchat
    $('form').submit(function(e){
        e.preventDefault();//Bloque le rechargement de la page
        let message = {
            text: $('#m').val()
        }
        if(message.text.trim().length !== 0){//trim retire les champs vide en debut et fin de chaine
            socket.emit('chat-message', message);
        }
        $('#m').val('');//Vide le champ texte
        //Gestion message vide
        $('#chat input').focus();//Focus sur le champ du message
    });

    //Réception du message envoyé au serveur et affichage
    socket.on('chat-message', function (message) {
            let datetime = new Date;
            time = Intl.DateTimeFormat(locale, options).format(datetime);
        $('#messages').append($('<li><span class="username">').text(time + ' -> ' + message.username + ' : ' + message.text));
        scrollToBottom();
    });
        
    // Connexion d'un nouvel utilisateur
    socket.on('user-login', function (user) {
        $('#users').append($('<li class="' + user.username + ' new">').html(user.username));
        setTimeout(function () {
            $('#users li.new').removeClass('new');
        }, 1000);
    });

    // Déconnexion d'un utilisateur
    socket.on('user-logout', function (user) {
        let selector = '#users li.' + user.username;
        $(selector).remove();
    });

    //Scroll en bas à la réception d'un message
    function scrollToBottom() {
        if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()){
            $("html, body").animate({ scrollTop: $(document).height() }, 0);
        }
    }
    
    //Apparation et disparition du chat sur click button
    $("#hide").click(()=>{
        $("#chat").toggle(1000, "linear", ()=>{
            if($("#chat").is(':visible')){
                $("#hide").text("Masquer");
            } else if($("#chat").is(':hidden')){
                $("#hide").text("Afficher Chat");
            }
        });
    });

    //Bouton de deconnexion
    $(".logout").click(function(){
        $.post('http://localhost:3000/logout',
        {
            playername: get_player
        },
        function(data){
            if(data === 'true'){
                document.location.href='http://localhost/Galactica.io/Apache/Public/';
            }
        });
    });
});


//FONCTIONNALITÉ AFFICHAGE DU GRAPHIQUE DE STAT
$("#historique").click(function(){
    $(".plateau").toggle(1000,"linear",()=>{
        if($(".plateau").is(':visible')){
            $("#historique").text("Historique");
        } else if($(".plateau").is(':hidden')){
            $("#historique").text("Masquer historique");
        }
    })
    let get_url = document.location.href.split("/");
    let get_player = get_url[get_url.length - 1];
    $.post("http://localhost:3000/getstats",
    {name: get_player},
    function(data){
        makeData(data)
    });
    function makeData(t){
        tab = [[0, 0]];
        let tablo = t;
        let score = 0;
        for(let i = 1; i < tablo.length; i++) {
            if (tablo[i] === "W") {
                score += 1;
                tab.push([i, score]);
            }
            else if ( tablo[i] === "L") {
                score -= 1;
                tab.push([i, score]);
            }
        }
        return tab          
    }
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBasic);
    function drawBasic() {  
        let data = new google.visualization.DataTable();
        if(tab.length === 1){
            $(".historique").text('');
            $(".historique").append("<p class='noStats'>Vous n'avez pas d'historique de parties !")
        }
        else{
            data.addColumn('number', 'X');
            data.addColumn('number', 'Evolution jeu');
            for(let i=0; i<tab.length; i++){
                data.addRows([tab[i]]);
            }
            let dataView = new google.visualization.DataView(data);
            dataView.setColumns([
                0, 1,
                {
                calc: function(data, row) {
                    let colorUp = 'white';
                    let colorDown = 'red';
                    if ((row === 0) && (data.getValue(row, 1) < data.getValue(row + 1, 1))) {
                        return colorUp;
                    } else if ((row > 0) && (data.getValue(row - 1, 1) < data.getValue(row, 1))) {
                        return colorUp;
                    }
                        return colorDown;
                },
                type: 'string',
                role: 'style'
                }
            ]);
            let options = {
                legendTextStyle: { color: 'white' },
                colors: ['white'],
                pointSize: 8,
                backgroundColor: '#0d0d0d',
                textColor: 'white',
                lineWidth: 3,
                hAxis: {
                title: 'Nombre de partie',
                textStyle:{color: 'white'},
                titleTextStyle: { color: 'white' },
                },
                vAxis: {
                title: 'Score',
                textStyle:{color: 'white'},
                titleTextStyle: { color: 'white' },
                },
            };
            let chart = new google.visualization.LineChart(document.getElementById('chart_div'));
            chart.draw(dataView, options);
        }
    }
});

