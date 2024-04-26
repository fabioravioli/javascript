/*immagini per card*/

const animals = ["img/card/animali/01.png", "img/card/animali/02.png", "img/card/animali/03.png", "img/card/animali/04.png", 
"img/card/animali/05.png", "img/card/animali/06.png", "img/card/animali/07.png", "img/card/animali/08.png", "img/card/animali/09.png", 
"img/card/animali/10.png", "img/card/animali/11.png", "img/card/animali/12.png", "img/card/animali/13.png", "img/card/animali/14.png",
"img/card/animali/15.png", "img/card/animali/16.png", "img/card/animali/17.png", "img/card/animali/18.png"];

/*OPZIONI DI GIOCO*/

let CARD = 12; //il numero delle carte totali sul campo di gioco

let maxCARDperROW = 0; //numero massimo di card visualizzabili per ogni riga

let ROW = 0; //numero di righe della griglia di gioco

//il campo di gioco
let grid = '';

//il selettore delle righe che contengono le card
let rowContainer = '';

//quante immagini diverse devo generare
nImg = CARD / 2;

//array contenente i riferimenti alle immagini da utilizzare; l'array contiene già i valori duplicati
let images = [];


//conterrà i riferimenti a tutte le card nel campo di gioco
let allCard = [CARD];

//il contenuto da mostrare quando la carta è coperta; necessario lo spazio vuoto per questioni di visualizzazione
const cardDefault = '<img src="img/retroCard.png">';


//contatore del punteggio
let punteggio = '';

//html che visualizza il punteggio
let countContainer = '';

//tiene traccia del numero di click; 1 se è la prima carta cliccata, 2 se è la seconda; viene resettato a 0 ogni 2 click
let cardClick = '';

//la prima carta cliccata di ogni mano
let card1 = '';

//il pulsante per iniziare un nuovo gioco
let buttonNewGame = '';

let levelButton = [];

//conterrà il messaggio di vittoria
let endMessage = '';


//avvio il gioco
start ();



//richiama tutte le funzioni necessarie all'avvio e allo svolgimento del gioco
function start () {
    init ();

    calcGrid();

    loadImage ();

    createGrid();

    recoveryAvailableClick();

    gestioneNewGame ();

    gestioneLivelli ();
}


//inizializza e riporta i parametri allo stato iniziale
function init () {
    grid.innerHTML = '';
    grid = document.querySelector(".grid");

    punteggio = 0;

    countContainer = document.querySelector(".message #punteggio");
    countContainer.innerText = punteggio;

    buttonNewGame = document.querySelector("#newgame");

    levelButton = document.querySelectorAll(".livelli button");

    endMessage = document.querySelector(".end");
   
    endMessage.innerText = '';

    cardClick = 0;

    points = 0;

}

//calcola le dimensioni della griglia e tutti i dati necessari al gioco
function calcGrid () {
    maxCARDperROW = Math.floor(Math.sqrt(CARD)); //numero massimo di card visualizzabili per ogni riga

    ROW = Math.ceil (CARD / maxCARDperROW); //numero di righe della griglia di gioco

    //quante immagini diverse devo generare
    nImg = CARD / 2;
}

//crea l'array contenente tutte le carte, ripetute due volte
function loadImage() {

    let appArray = [nImg];
  
    for (n = 0; n<nImg; n++) {
        appArray[n] = animals[n];
    }
    images = appArray.concat(appArray);
}

/*
crea l'Html del campo di gioco
nel div contenente le card ci sono alcuni parametri:
data-cover: = 1 indica che deve essere visualizzata l'immagine del retro della carta
data-index: l'indice della card nell'array contenente tutte le card in gioco
data-valore: il valore della card rapprsentato dal suo path

Inizialmente viene inserito un img contenente l'immagine di default, ossia il retro della carta
*/
function createGrid () {
    
    rowContainer = document.querySelectorAll(".grid .rowContainer"); 

    //aggiornato ad ogni iterazione, conterrà l'output html da inserire nel div
    let output = '';

    //l'indice, generato casualmente ad ogni iterazione, da utilizzare per recupare una card dall'array di tutte le card possibili
    let index = 0;

    //creo un copia dell'array contenente le immagini da utilizzare in modo da non distruggere l'originale
    let tempArray = images;
    
    //tiene traccia di quante card ho generato
    let contatore = 0;

    for (let i = 0; i < ROW; i++) {
        output += '<div class="rowContainer">';

        for (let j = 0; j < maxCARDperROW; j++) {
            if (contatore < CARD) { //se ci sono ancora card da genereare...

                //genero un indice casuale compreso tra 0 e la lunghezza dell'array delle carte
                index = Math.floor(Math.random() * tempArray.length );

                //aggiungo la card generata all'array contenente le card in ordine di generazione
                allCard[contatore] = tempArray[index];
                
                //genero l'html con i dati appena ottenut
                output += ' <div class="card" data-index="' + contatore + '" data-valore="'+ tempArray[index] +'">' + cardDefault + ' </div>'; 

                //...rimuovo la card appena generata dall'array della card utilizzabili, per non rischiare di generarla nuovamente
                tempArray.splice(index,1);

                //aggiorno il contatore delle carte generate
                contatore++;
            }
        }
        output += '</div>';
    }

    grid.innerHTML = output;

}

//gestisce gli eventi legati ai click delle card
function clickCard () {

    /* scopro la carta cliccata */

    //memorizzo il path dell'immagine da visualizzare
    var path = this.getAttribute("data-valore");

    //sostituisco l'img di default con l'immagine della card cliccata
    this.innerHTML = '<img src="'+ path +'">';

    //faccio in modo che la carta non possa essere selezionata  nello stesso turno
    this.removeEventListener('click', clickCard);

    //aggiorno il contatore di coppie selezionate
    cardClick++;

    //se è la prima card di una coppia, fa solo una stampa di servizio
    if (cardClick == 1) {
        card1 = this;
    }

    //se è la seconda card di una coppia
    else if (cardClick == 2) {
        let card2 = this;
        removeAllClick();

        //se la coppia selezionata ha lo stesso valore
        if (card1.getAttribute("data-valore") == card2.getAttribute("data-valore")) {
    
            punteggio++; //aggiorno il punteggio
            countContainer.innerText = punteggio; //stampo il punteggio
        
            //imposto un data- per indicare che la carta non deve essere mai più coperta né cliccata
            card1.setAttribute("data-show", 1);
            card2.setAttribute("data-show", 1);
            
            //se ho scoperto tutte le coppie, fine del gioco
            if (punteggio == (CARD / 2)) {
                endGame();
            }
            else {
                nextRound();
            }
        }
        else {
            setTimeout(function (){
                //ripristino la visualizzazione delle 2 card scelte, con l'immagine del retro della carta
                card1.innerHTML = cardDefault;
                card2.innerHTML = cardDefault;

                nextRound();

            }, 1000);

        }
        

    }
}

//gestisce le operazioni da svolgere quando si termina il gioco
function endGame () {
    endMessage.innerText = "HAI VINTO!";
}

//gestione il click del pulsante 'new game'
function gestioneNewGame () {
    buttonNewGame.addEventListener('click', start);
}

//gestione il click dei pulsanti per la scelta del livello
function gestioneLivelli (){  
    levelButton.forEach(function(lb) {
        lb.addEventListener('click', setLevel);
    })
}


function setLevel () {
    var level = this.getAttribute("data-level");

    if (level == '1') {
        CARD = 12;
        start();
    }
    else if (level == '2') {
        CARD = 24;
        start();
    }
    else if (level == '3')
        CARD = 36;
        start();

}


//rimuove i click listener a tutte le card
function removeAllClick (){
    allCard = document.querySelectorAll(".grid .card");

    allCard.forEach(function(c){
        c.removeEventListener('click', clickCard);
    })

}


//mette un click listener a tutte le card non ancora scoperte
function recoveryAvailableClick () {
    allCard = document.querySelectorAll(".grid .card");
    
    allCard.forEach(function(c) {
        if ( c.getAttribute("data-show") != '1') {
            c.addEventListener('click', clickCard);
        }
    })
}


//viene richiamata al termine del confronto tra due carte; resetta il contatore delle card scelte e ripristina i click sulle carte
function nextRound () {
    //una coppia di card è stata selezionata quindi resetto il contatore
    cardClick = 0;

    //ripristino tutti i click
    recoveryAvailableClick ();
}
