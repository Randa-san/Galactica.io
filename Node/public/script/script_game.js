// ===========       PARTIE INITIALISATION DU CANVAS       ===========

// Création du canvas
let renderer = PIXI.autoDetectRenderer(1200, 800, {
    transparent: true
});
//document.body.appendChild(renderer.view);
$('.plateau2').append(renderer.view)
renderer.view.style.border = "2px solid #5dcff1";

// Création du background
let stage = new PIXI.Container();
stage.interactive = true;

// Affichage du background 
let tile, tilingSprite, count = 0;
tile = PIXI.Texture.fromImage('./media/espace.jpg');
tilingSprite = new PIXI.extras.TilingSprite(tile, 2300, 1500);
tilingSprite.anchor.x = 0.5;
tilingSprite.anchor.y = 0.5;
tilingSprite.position.x = 600;
tilingSprite.position.y = 350;
stage.addChild(tilingSprite);

// Message d'attente quand le joueur est seul
let style = new PIXI.TextStyle({
    fontFamily: "Iceland",
    fontSize: 60,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    align: "center",
});
let styledMessage = new PIXI.Text("Bienvenue sur Galactica.io\n La partie va bientôt commencer", style);
styledMessage.position.set(260, 300);
stage.addChild(styledMessage);

// Chargement des textures de vaisseaux
let starshipOne = PIXI.Texture.fromImage('./media/ship1.gif');
let starshipTwo = PIXI.Texture.fromImage('./media/ship2.gif');
let starshipThree = PIXI.Texture.fromImage('./media/ship3.gif');
let starshipFour = PIXI.Texture.fromImage('./media/ship4.gif');
let starshipFive = PIXI.Texture.fromImage('./media/ship5.gif');

// Chargement des textures de missiles
let bulletText = PIXI.Texture.fromImage('./media/bullet1.png');

// Attribution des texture en sprite
let starship1 = new PIXI.Sprite(starshipOne);
let starship2 = new PIXI.Sprite(starshipTwo);
let starship3 = new PIXI.Sprite(starshipThree);
let starship4 = new PIXI.Sprite(starshipFour);
let starship5 = new PIXI.Sprite(starshipFive);

// Attribution de l'ancre des vaisseaux
starship1.anchor.set(0.5);
starship2.anchor.set(0.5);
starship3.anchor.set(0.5);
starship4.anchor.set(0.5);
starship5.anchor.set(0.5);

// Tableau de vaisseaux
starships = [starship1, starship2, starship3, starship4,starship5]

// ===========       DESSIN DES BARRES DE VIES       ===========

// Création background de la barre de vie du joueur 1
let health_p1 = new PIXI.Container;
health_p1.position.set(540, 5)
stage.addChild(health_p1);
// Creation de fond la couleur de la barre de vie
let innerBar = new PIXI.Graphics;
innerBar.beginFill(0x000000);
innerBar.drawRect(0, 0, 135, 14);
innerBar.endFill();
health_p1.addChild(innerBar);
// Creation de la couleur de la barre de vie
let outerBar = new PIXI.Graphics;
outerBar.beginFill(0xFF3300);
outerBar.drawRect(3, 3.4, 129, 8);
outerBar.endFill();
health_p1.addChild(outerBar);
health_p1.outer = outerBar;

// Création background de la barre de vie du joueur 2
let health_p2 = new PIXI.Container;
health_p2.position.set(540, 782)
stage.addChild(health_p2);
// Creation de la couleur de la barre de vie
let innerBar2 = new PIXI.Graphics;
innerBar2.beginFill(0x000000);
innerBar2.drawRect(0, 0, 135, 14);
innerBar2.endFill();
health_p2.addChild(innerBar2);
// Creation de la couleur de la barre de vie
let outerBar2 = new PIXI.Graphics;
outerBar2.beginFill(0xFF3300);
outerBar2.drawRect(3.5, 3.4, 129, 8);
outerBar2.endFill();
health_p2.addChild(outerBar2);
health_p2.outer = outerBar2;

// ===========       PARTIE INITIALISATION DU POSITIONNEMENT DES JOUEURS       ===========
let playername;
let players = [];
let player;

// Création de l'objet player selon l'emit du serveur
socket.on('player', function(data){
    $(".plateau").hide();
    $(".plateau2").show();
    if(data.player === 1){
        player = new Player(data.playername,data.player,data.index,610,100,60,60,0.5,0.5)
        socket.emit('player_datas', {player: player.player, x: player.x, y: player.y});
        requestAnimationFrame(animate)
    }
    else if(data.player === 2){
        player = new Player(data.playername,data.player,data.index,610,700,60,60,0.5,0.5)
        socket.emit('player_datas', {player: player.player, x: player.x, y: player.y})
        requestAnimationFrame(animate)
    }
});

// Dessine notre vaisseau et actualise sa position
function drawPlayer(){
    stage.addChild(starship1)
    starship1.x = player.x;
    starship1.y = player.y; 
}

// ===========       TRAITEMENT DES DONNEES DE L'ADVERSAIRE       ===========

// Dessine le vaisseau adverse et actualise ces coordonnées et sa rotation
socket.on('players list', function(list) {
    if(player.player == 1 && list.length == 2){
        stage.addChild(starship2)
        starship2.x = list[1].x;
        starship2.y = list[1].y;
        starship2.rotation = list[1].rotation;
        stage.removeChild(styledMessage)
    }
    else if(player.player == 2 && list.length == 2){
        stage.addChild(starship2)
        starship2.x = list[0].x;
        starship2.y = list[0].y;
        starship2.rotation = list[0].rotation;
        stage.removeChild(styledMessage)
    }
})

// Traitement des balles tirées par l'adversaire
let bullets_opponent = [];  
let bulletSpeed_opponent = 11;
socket.on('bulletShot', function(data){ // Enregistre la balle tirée par l'adversaire a l'instant T.
    if(player.player == 1){ // Enregistre les coordonnées de la balle ainsi que son angle de tir
        let bullet = new PIXI.Sprite(bulletText);
        bullet.x = data[1].bx;
        bullet.y = data[1].by;
        bullet.rotation = data[1].br;
        bullets_opponent.push(bullet);
        stage.addChild(bullet);
    }
    if(player.player == 2){
        let bullet = new PIXI.Sprite(bulletText);
        bullet.x = data[0].bx;
        bullet.y = data[0].by;
        bullet.rotation = data[0].br;
        bullets_opponent.push(bullet);
        stage.addChild(bullet);
    }   
})

// Affiche les tirs adverse préalablement stockés dans le tableau, description des fonctionnalités dans la fonction playerShot qui elle gère les tirs et collisions du joueur
function opponentShot(){
    for(let b=bullets_opponent.length-1;b>=0;b--){
        bullets_opponent[b].x += Math.cos(bullets_opponent[b].rotation) * bulletSpeed_opponent;
        bullets_opponent[b].y += Math.sin(bullets_opponent[b].rotation) * bulletSpeed_opponent;
        // Gestion collision du tirs ennemis sur le joueur
        if(rayon(Math.round(bullets_opponent[b].x), Math.round(bullets_opponent[b].y), player.x, player.y, 40) == true){// On détecte si les balles ennemis nous ont touchées
            stage.removeChild(bullets_opponent[b])
            bullets_opponent.splice(0,1);
            if(health_p1.outer.width > 0 && player.player == 1){
                health_p1.outer.width -= 12.9
                if(Math.round(health_p1.outer.width) <= 0){
                    gameover('loose')
                }
            }
            else if(health_p2.outer.width > 0 && player.player == 2){
                health_p2.outer.width -= 12.9
                if(Math.round(health_p2.outer.width) <= 0){
                    gameover('loose')
                }
            }
            // healthbar(); Fonctionnalité désactivées qui traite les collisions sur le serveur ( voir bas du script )
        }
        else if((bullets_opponent[b].x >= 2000 || bullets_opponent[b].x <= -500) || (bullets_opponent[b].y >= 2000 || bullets_opponent[b].y <= -500)){
            bullets_opponent.splice(0,1);
        }
    }
}

// Calcul la collision des balles
// Description => xa = Position x de la balle du joueur, yb = Position y de la balle du joueur, x et y coordonnées du vaisseau adverse, r = rayon 'hitbox' du vaisseau adverse
function rayon(xa,yb,x,y,r){
    if ((Math.pow(x - xa, 2) + Math.pow(y - yb, 2)) < Math.pow(r, 2)) {
        return true
    }
}

// ===========       Configuration du clavier      ===========

const keyboard = {};
window.onkeydown = function(e) {
    keyboard[e.keyCode] = true;  
};

window.onkeyup = function(e) {
    delete keyboard[e.keyCode];
};

// ===========       Tirs du joueur & Rotations      ===========

let bullets = [];  
let bulletSpeed = 11;

// Event du clic de tir
stage.on("mousedown", function(e){
    shoot(starship1.rotation)
})

// Stock la position de la balle et sa rotation
function shoot(rotation){  
    let bullet = new PIXI.Sprite(bulletText);
    bullet.x = player.x;
    bullet.y = player.y;
    bullet.rotation = rotation;
    stage.addChild(bullet);
    bullets.push(bullet);
    socket.emit('bullets', {x: bullet.x, y: bullet.y, r: bullet.rotation})
};

// Retourne l'angle de la rotation
function rotateToPoint(mx, my, px, py){  
    let self = this;
    let dist_Y = my - py;
    let dist_X = mx - px ;
    let angle = Math.atan2(dist_Y,dist_X);
    return angle;
};

// Gère la rotation du vaisseau selon le pointeur de la souris
function shipRotation(){
    starship1.rotation = rotateToPoint(renderer.plugins.interaction.mouse.global.x, renderer.plugins.interaction.mouse.global.y, starship1.x, starship1.y);
    socket.emit('ship rotation', starship1.rotation);
}

// Gère le déplacement des tirs
function playerShot(){
    for(let b=bullets.length-1;b>=0;b--){//Traite en boucle l'element zero du tableau
        bullets[b].x += Math.cos(bullets[b].rotation) * bulletSpeed;
        bullets[b].y += Math.sin(bullets[b].rotation) * bulletSpeed;
        // Condition pour vérifier si les balles du joueur touchent l'adversaire
        if(rayon(Math.round(bullets[b].x), Math.round(bullets[b].y), starship2.x, starship2.y, 40) == true){
            stage.removeChild(bullets[b])//Fait disparaitre la balle quand elle touche
            bullets.splice(0,1);// Retire la balle du tableau
            if( health_p2.outer.width > 0 && player.player == 1){
                health_p2.outer.width -= 12.9 // Tant que la vie est supérieur à 0, on retire des points de vie
                if(Math.round(health_p2.outer.width) <= 0){// Quand la vie atteind zéro, on envoie la fonction gameover
                    gameover('win')
                }
            }   
            else if(health_p1.outer.width > 0 && player.player == 2){
                health_p1.outer.width -= 12.9
                if(Math.round(health_p1.outer.width) <= 0){
                    gameover('win')
                }
            }
        }
        else if((bullets[b].x >= 2000 || bullets[b].x <= -500) || (bullets[b].y >= 2000 || bullets[b].y <= -500)){//Supprime les balles qui sortent du cadre de jeu
            bullets.splice(0,1);
        } 
    } 
}

// ===========       Gestion de la fin de partie       ===========

// Affiche l'écran de fin de partie
function gameover(m){
    if(m === 'win'){
        gameOver = new PIXI.Text("Victoire !!!\n Vous avez ecrasé votre adversaire !!", style);
        gameOver.position.set(280, 300);
        stage.interactive = false; // Désactive les tirs
        stage.addChild(gameOver);
        socket.emit('win', player.playername);
        redirect(player.playername);
    }
    else if(m === 'loose'){
        gameOver = new PIXI.Text("Défaite !!!\n Vous vous êtes fait défoncer !!", style);
        gameOver.position.set(260, 300);
        stage.interactive = false;
        stage.addChild(gameOver);
        socket.emit('loose', player.playername)
        redirect(player.playername), 3000;
    }
    if(player.player == 1){ // Bloque le déplacement des joueurs à la fin de la partie
        player.x = 610;
        player.y = 100;
    }
    else{
        player.x = 610;
        player.y = 700;
    }
    requestAnimationFrame(gameover)
}

//Redirection automatique de fin de partie
function redirect(n){
    setTimeout(function(){ document.location.href="http://localhost:3000/lobby/"+n; }, 3000); 
}
            
// ===========       Anime le plateau et ces fonctions en boucle       ===========

function animate() { 
    requestAnimationFrame(opponentShot)//Dessine les tirs adverse
    requestAnimationFrame(drawPlayer)//Dessine notre vaisseau
    requestAnimationFrame(shipRotation)//Rotation de notre vaisseau
    requestAnimationFrame(playerShot)//Tir de nos missiles
    player.movePlayer();//Déplace notre vaisseau
    requestAnimationFrame(animate);// Appel en boucle la fonction animate à 60 fps
    tilingSprite.rotation = 1 + count/2;//Fait tourner le background du plateau de jeu
    count += 0.001;//time la rotation du background du plateau de jeu
    renderer.render(stage);// Affiche le plateau de jeu en boucle
};


// ===========       Fonctionnalités désactivées       ===========

//Fonction qui affiche les barres de vie selon les collisions, géré oar le serveur
// function healthbar(){
//     if( health_p1.outer.width > 0 && player.player == 1 ){
//         health_p1.outer.width -= 12.9
//         socket.emit('health_p1', 'TIR JOUEUR 2 BLESSE JOUEUR 1')
//     }
//     else if(health_p2.outer.width > 0 && player.player == 2){
//         health_p2.outer.width -= 12.9
//         socket.emit('health_p2', 'TIR JOUEUR 1 BLESSE JOUEUR 2')
//     }
// }

// socket.on('health_p1_state', function(data){
//     health_p1.outer.width -= 12.9
// })

// socket.on('health_p2_state', function(data){
//     health_p2.outer.width -= 12.9
// })