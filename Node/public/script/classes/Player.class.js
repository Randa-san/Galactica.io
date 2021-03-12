class Player {
    playername;
    player;
    index;
    x;
    y;
    width;
    height;
    anchorx;
    anchory;

    //Constructeur
    constructor(pn,p,i,x,y,w,h,ax,ay) {
        this.playername = pn;
        this.player = p;
        this.index = i;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.anchorx = ax;
        this.anchory = ay;
    }

    movePlayer() {
        //Gauche
        if (keyboard[81]){
            if(this.x >= 50){
                socket.emit('move left', player);
                this.x -= 7;
            }       
        }
        //Haut
        if (keyboard[90]){
            if((this.y >= 50 && this.y <= 350) || (this.y >= 440 && this.y <= 760)){
                socket.emit('move up', player);
                this.y -= 7;
            }
        } 
        //Droite
        if (keyboard[68]){
            if(this.x <= 1150){
                socket.emit('move right',player);
                this.x += 7;
            }
        }
        //Bas
        if (keyboard[83]){
            if((this.y <= 340 && this.y >= 0) || (this.y <= 750 && this.y >= 370)){
                socket.emit('move down',player);
                this.y += 7;
            }
        }
    } 

}//fin classe player

module.exports = Player;