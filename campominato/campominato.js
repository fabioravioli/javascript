/* IMPOSTAZIONI DI GIOCO */ 
 let rows = 9;
let columns = 9;
let bombe = 10; 


//stringa per rapparesentare graficamente la bomba e la bandierina
const MYBOMB = "💣";
const MYFLAG = "🚩";


//la griglia che conterrà il campo di gioco
let htmlGrid = '';

//il div contatore delle bandierine disponibili
let countFlagged = '';

//l'array / matrice  per contenere la logica del campo di gioco
let grid = [];

//il numero delle bandierine ancora piazzabili
let dispFlag = '';


//contiene il box per i messaggi di vittoria o sconfitta
let messageBox = '';

//il pulsante per generare una nuova partita
let newGameButton = '';

//i pulsanti per selezionare i livello di gioco
let levelChoice = '';

//tutti i pulsanti del campo di gioco
let allButton = '';



//fa partire il gioco
start ();



//fa iniziare il gioco
function start () {

    init ();

    generaBombe();

    generaIndicatori();

    creaHtml ();

    levelButton ();

    newGame ();

    gestioneButton ();  

}

//inizializza tutte la variabili di gioco
function init () {

    //seleziono la griglia che conterrà il campo di gioco
    htmlGrid = document.querySelector(".grid");

    //disabilito l'apertura del menu quando clicco col tastro destro sulla griglia
    htmlGrid.addEventListener('contextmenu', dxDisable);

    //seleziono il div contatore bandierine disponibili
    countFlagged = document.querySelector(".countFlagged");

    //setto il numero delle bandierine ancora piazzabili (pari al numero di bombe)
    dispFlag = bombe;

    
    //seleziono il box per i messaggi di vittoria o sconfitta
    messageBox = document.querySelector(".message");


    /* inserisco tutti valori 0 nella griglia */
    for (var i = 0; i<rows; i++) {
        var r = [];
        for (var j = 0; j<columns; j++) {
            r[j] = 0;
        }
        grid [i] = r;
    }

}

//resetta i contatori, i listener, la griglia di gioco
function reset () {

    htmlGrid.removeEventListener('contextmenu', dxDisable);
    //resetta la parte html della griglia di gioco
    htmlGrid.innerHTML = '';

    //resetta il div che contiene i messaggi, eliminando anche le classi che determinano lo stile
    messageBox.innerText = '';
    messageBox.classList.remove("winner");
    messageBox.classList.remove("lose");


    countFlagged = '';

    //il listener va rimosso poiché in fase di inizializzazione ne viene assegnato un nuovo
    newGameButton.removeEventListener('click', newGame);

    levelChoice.forEach(function (lb) {

        lb.removeEventListener('click',setLevel);
    }) 


    
    start();
}

//funzione che inserisce in maniera casuale le bombe all'interno della griglia
function generaBombe () {

    //variabile che tiene traccia di quante bombe devo ancora caricare nel gioco
    var count_bombs = bombe;


    //inserisco le bombe (valore -1 o simbolo a piacimento) in maniera casuale
    //controllando che non capiti una cella già occupata da una bomba
    while (count_bombs > 0) { //finché ci sono bombe da inserire
        var x = Math.floor(Math.random() * rows); //creo un indice casuale per le righe
        var y = Math.floor(Math.random() * columns); //creo un indice casuale per le colonne

        if (grid[x] [y] != MYBOMB) {
            grid[x][y] = MYBOMB;
            count_bombs -= 1;
        }
    }

}

//funzione che scorre tutta la matrice e incrementa di 1 il valore delle celle che sono vicine ad una bomba
function generaIndicatori () {
    //genero gli indicatori numerici
    for (var x = 0; x<rows; x++) {
        for (var y = 0; y<columns; y++) {
            //se nella cella c'è una bomba
            if (grid [x][y] == MYBOMB) {
                //incrementa di 1 il valore delle celle adiacenti
                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        
                        var m = x+i;
                        var n = y+j;

                        if (m == x && n ==y) { //se non è la cella stessa
                            continue;
                        }
                        else {
                            //...ad esclusione delle celle che non rientrano nel range della matrice
                            if ( m >= 0 && m <rows && n >=0 && n< columns) {
                                if (grid [m] [n] != MYBOMB) { //se nella cella non è già presente una bomba
                                    grid [m] [n] += 1; 
                                }
                            }    
                        }
                    }
                }    
            }
        }
    }
}

//funzione che si occupa di generare i tag HTML necessari
function creaHtml () {

    countFlagged.innerText = dispFlag;

    var valore = '';
    
    var output = '';

    for (var i = 0; i<rows; i++) {
        
        for (var j = 0; j<columns; j++) {
            valore = grid [i] [j];

            if (valore == 0) {
                valore = '';
            }

            output += '<div class="cella" data-buttonX="'+i+'"data-buttonY="'+j+'" data-valore="' + valore + '" >';

            //output += '<button class="cella" type="button" data-buttonX="'+i+'" data-buttonY="'+j+'" data-valore="'+ valore +'"></button>';

            output += '</div>';
        }
        output += '<div class="clearfix"></div>';
    }
    
    htmlGrid.innerHTML = output;
    
}

//gestisce i pulsanti per selezionare il livello di difficoltà
function levelButton () {
    levelChoice = document.querySelectorAll(".livelli button");

    levelChoice.forEach(function (lb) {

        lb.addEventListener('click',setLevel);
    }) 
}

//imposta i parametri in base al livello selezionato
function setLevel () {
    let level = parseInt(this.getAttribute("data-level"));

    if (level == 1) { //beginner
        rows = 9;
        columns = 9;
        bombe = 10;
    }
    else if (level == 2) { //intermedio
        rows = 16;
        columns = 16;
        bombe = 40;
    } 
    else if (level == 3) { //expert
        rows = 16;
        columns = 30;
        bombe = 99;
    }

    reset();
}

//gestisce il comportamento del pulsante "NEW GAME"
function newGame() {

    newGameButton = document.querySelector("#newGame");
    newGameButton.addEventListener('click', reset);

}

//gestisce il comportamente quando viene cliccata una cella con bomba
function endGame (cond) {

    if (cond) {
        messageBox.innerText = "HAI VINTO!"
        messageBox.classList.add("winner");
    }
    else {
        messageBox.innerText = "HAI PERSO!"
        messageBox.classList.add("lose");

        //mostra le bombe rimaste e disabilità gli altri pulsanti
        allButton.forEach (function(b, index) {
            var dataRow = b.getAttribute("data-buttonX");
            var dataCol = b.getAttribute("data-buttonY");
            var valoreCella = b.getAttribute("data-valore");

            if (grid [dataRow] [dataCol] == MYBOMB) {
                b.innerText = valoreCella; // mostro la bomba
                b.classList.add ("selected");
            }
            b.removeEventListener('click', clickCell );
            b.removeEventListener('contextmenu', insertFlag);
        });
    }



}

//si occupa di creare i listener e di gestire i comportamenti conseguenti al click sopra ogni cella
function gestioneButton () {
    allButton = document.querySelectorAll(".grid .cella");
    allButton = Array.from(allButton);

    allButton.forEach (function (b) { //per ogni bottone del campo di gioco...
            b.addEventListener('click', clickCell );
            b.addEventListener('contextmenu', insertFlag);    
    }
    )
}

//disabilita l'apertura del menu di contesto al click del tasto destro del mouse
function dxDisable () {
    event.preventDefault();
}

//recupera la cella cliccata e ne richiama la funzione per mostrarne il contenuto
function clickCell() {
    b = this;
    showCell(b);
}

//mostra il contenuto di una cella specifica
function showCell (b) {
    
    if (b.innerText != MYFLAG) {  //se non contiene una bandierina
        //recupero le coordinate
        var dataRow = b.getAttribute("data-buttonX");
        var dataCol = b.getAttribute("data-buttonY");
        var valoreCella = b.getAttribute("data-valore");

        b.innerText = valoreCella;
        b.classList.add ("selected");

        //aggiornare la lista dei bottoni è utile per determinare la vittoria del giocatore
        for (z = 0; z<allButton.length; z++) {
            if (allButton[z].getAttribute("data-buttonX") == dataRow && allButton[z].getAttribute("data-buttonY") == dataCol) {
                allButton.splice(z,1); //...e lo tolgo dall'array dei bottoni disponibili
            }
        }
        
        b.removeEventListener('contextmenu', insertFlag);   
       
        //controllo il contenuto della cella
        if (grid [dataRow] [dataCol] == MYBOMB) { //se c'è una bomba...
            b.classList.add("colpita");
            endGame(false); //...dichiaro la sconfitta
        }
        else if (allButton.length - bombe == 0){ //...altrimenti se ho scoperto tutte le celle possibili
            endGame(true); //...dichiaro la vittoria
        }
        else if (grid [dataRow] [dataCol] == 0) { //altrimenti se c'è uno zero...
            expandZero (b); //richiamo la funzione ricorsiva per scoprire tutte le celle che contengono uno 0
        }            
    }
}

//inserisce e rimuove un flag nella cella selezionata
function insertFlag () {
    if (dispFlag > 0){ //posso piazzare un numero di bandierine per un massimo del numero di bombe presenti
        //se non è già presente una bandierina la aggiungo
        if (this.innerText != MYFLAG) { 
            this.innerText = MYFLAG;
            dispFlag -= 1;
        }
        else if (this.innerText == MYFLAG) { //se la bandierina c'è già, la tolgo
            this.innerText = '';
            dispFlag += 1;
        }
        countFlagged.innerText = dispFlag; //infine aggiorno il valore a video
    }
}

//funzione che controlla ricorsivamente se le celle adiacenti del button cliccato (di coordinate x,y) hanno valore 0 ed eventualmente le scopre
function expandZero(b) {

    //recupero le coordinate
    var dataRow = b.getAttribute("data-buttonX");
    var dataCol = b.getAttribute("data-buttonY");
            
    //-1 e +1 sono le possibili variazioni di indice per le celle adiacenti
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {

            //m e n sono le coordinate della cella, adiacente al button cliccato, che sto considerando
            var m = parseInt(dataRow)+i;
            var n = parseInt(dataCol)+j;

            if (m == dataRow && n == dataCol) { //se sto analizzando la cella che ha generato il click, non faccio niente
                continue;
            }
            else {
                //...ad esclusione delle caselle che non rientrano nel range della matrice
                if ( m >= 0 && m <rows && n >=0 && n< columns) {
                    for (z = 0; z<allButton.length; z++) {
                        if (allButton[z].getAttribute("data-buttonX") == m && allButton[z].getAttribute("data-buttonY") == n) { //cerco nella lista di tutti i bottoni quello che corrisponde alla coordinate m,n
                            if ( (grid [m][n] != MYBOMB) && allButton[z].innerText != MYFLAG) { //...e se la casella non contiene né una bomba né una bandierina
                                
                                showCell(allButton[z]);
                        }
                        } 
                    }
                } 
            }
        }
    }
}
