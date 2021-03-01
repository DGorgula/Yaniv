// More Features
// ==============
// counter to show the sum of the players cards.
//draw card-badname

// imports
import { Deck, Player, PileDeck, TableDeck, Card } from "./export-tomain.js";
import * as Functions from "./utils.js";

// elements

const addPlayerButton = document.getElementById("add-player-button");
const startGameButton = document.getElementById("start-button");
const startNewGameButton = document.getElementById("start-new-game");
const gameRulesButton = document.getElementById("game-rules");
const exitRulesButton = document.getElementById("exit-button");
const aboutUsButton = document.getElementById("about-us");

const gameControl = Functions.newRoundDealing({});

// run program
addPlayerButton.addEventListener("click", (event) => {
  Functions.addPlayer(event, gameControl, addPlayerButton, startGameButton);
});

startGameButton.addEventListener("click", (event) => {
  Functions.startGame(gameControl);
});
// startNewGameButton.addEventListener("click", () => {
//   document.location.reload(true);
// });

// variables

gameRulesButton.addEventListener("click", (event) => {
  const gameRulesDiv = document.getElementById("game-rules-div");
  if (gameRulesDiv.style.display === "none") {
    gameRulesDiv.style.display = "block";
  } else {
    gameRulesDiv.style.display = "none";
  }
});

exitRulesButton.addEventListener("click", (event) => {
  document.getElementById("game-rules-div");
  if (document.getElementById("game-rules-div").style.display === "block") {
    document.getElementById("game-rules-div").style.display = "none";
  } else {
    document.getElementById("game-rules-div").style.display = "block";
  }
});

aboutUsButton.addEventListener("click", (event) => {});
