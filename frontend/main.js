// More Features
// ==============
// counter to show the sum of the players cards.
//draw card-badname

// imports
import { Deck, Player, PileDeck, TableDeck, Card } from './export-tomain.js';
import * as Functions from './utils.js';

// elements
const addPlayerButton = document.getElementById('add-player-button');
const startGameButton = document.getElementById('start-button');
const startNewtGame = document.getElementById("start-new-game");


const gameControl = Functions.newRoundDealing({});


// run program
addPlayerButton.addEventListener("click", (event) => {
  Functions.addPlayer(event, gameControl, addPlayerButton, startGameButton);
});

startGameButton.addEventListener("click", (event) => {
  Functions.startGame(gameControl);
});
startNewtGame.addEventListener("click", () => { document.location.reload(true) });




// variables


