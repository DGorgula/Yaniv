import { Deck, Player, PileDeck, TableDeck, Card } from './export-tomain.js';
import { hidWelcomePage, randomOrderArray, catchElement, newElement, guessACard, getCheckedAvatar, switchTurn, updatePlayersCardsCounter, validationCaseOne, validationCaseTwo, validationCaseThree, validationCaseFour, asyncValidationCase } from './assistence-functions.js';


// Event Listeners:

function yanivListener(gameControl) {
  yanivRender(gameControl);///reveld cards , 
  theWinnerIs(gameControl);
  updateScoreTable(gameControl);// how is the winner , giving score , update
  renderScoreTable(gameControl); /// present the winner and the table
  const endGame = playersOver200Out(gameControl);
  if (endGame === "endGame") {
    return;
  }
  setNewFirstTurn(gameControl);// first player turn 
  setTimeout(() => {

    newRoundDealing(gameControl);//sets the desk for new round
    // updatePlayersCardsCounter(gameControl); fixed in the newRoundDealing func ^^
  }, 5);
}

function playersOver200Out(gameControl) {
  const players = gameControl.players;
  const tableScore = gameControl.tableScore;
  const playersLength = players.length;
  let looserPlayers = [];
  for (let i = 0; i < playersLength; i++) {
    if (players[i].score > 200) {
      looserPlayers.push(i);
      console.log("player loos");
    }
    else if (players[i].score === 200) {
      players[i].score = 0;
      tableScore.total[players[i].name] = 0
    }
  }
  looserPlayers.sort((a, b) => { return b - a });
  console.log(looserPlayers, players);

  for (const i of looserPlayers) {
    players.splice(i, 1);
  }
  console.log(looserPlayers, players);

  if (players.length === 1) {
    endGame(gameControl);
    debugger;
    // setTimeout(location.reload, 7000);
    setTimeout(() => { document.location.reload(true) }, 20000);
    return "endGame"
  }
  return looserPlayers;
}

function endGame(gameControl) {
  const gameWinner = gameControl.players[0].name;
  const deskContainer = catchElement("desk-container");
  newElement('div', null, `The Winner is ${gameWinner}!`, deskContainer, "game-winner-div");
}


function theWinnerIs(gameControl) {
  const players = gameControl.players;
  const YanivPlayer = gameControl.yanivDeclaration;
  let lowerScore = YanivPlayer.cardsSum;
  let winningType = 'Yaniv';
  let winnerPlayer = YanivPlayer;
  // console.log(players);
  // console.log(winnerPlayer + "declaer yaniv");
  for (const player of players) {
    if (player !== YanivPlayer && player.cardsSum <= lowerScore) {
      lowerScore = player.cardsSum;
      winningType = 'Asaf';
      winnerPlayer = player;///maybe to set yaniv decleration to asaf here
      YanivPlayer.cardsSum = 30;    // make the Yaniv declarator pay!!
      // console.log("asaf" + winnerPlayer);
    }
  }

  const winner = { winnerPlayer: winnerPlayer, winningType: winningType };
  winner.winnerPlayer.cardsSum = 0;
  winner.winnerPlayer.yanivDeclaration = false;
  return winner;
}

function startGame(gameControl) {
  hidWelcomePage();
  gameControl.players = randomOrderArray(gameControl.players);
  gameControl.players[0].turn = true;
  // console.log(gameControl.players);
  renderBoard(gameControl);
}

function addPlayer(event, gameControl, addPlayerButton, startGameButton) {
  const nameInput = document.getElementById("player-name");
  const newPlayerName = nameInput.value;
  nameInput.value = "";
  const playerDeck = gameControl.tableDeck.deal5Cards();
  const avatar = getCheckedAvatar();
  const players = gameControl.players;
  const playerId = gameControl.players.length + 1;
  const newPlayer = new Player(playerId, playerDeck, newPlayerName, avatar);

  gameControl.players = players;
  players.push(newPlayer);
  renderWelcomePagePlayers(newPlayer);
  if (players.length == 2) {
    startGameButton.hidden = false;
  } else if (players.length === 4) {
    addPlayerButton.hidden = true;
  }
}

//   rendering functions :
// =========================
// render added players to the welcome page
function renderWelcomePagePlayers(player) {
  const playerContainer = document.getElementById("players-container");
  const playerName = player.name;
  const playerAvatar = player.avatar;
  const playerId = player.id;

  const div = document.createElement("div");
  div.classList.add("welcome-player-div");

  const elemnentIndex = document.createElement("span");
  elemnentIndex.innerText = playerId;
  div.appendChild(elemnentIndex);

  const elementPlayerName = document.createElement("span");
  elementPlayerName.innerText = playerName;
  div.appendChild(elementPlayerName);

  const elementPlayerAvatar = document.createElement("span");
  elementPlayerAvatar.classList.add(`avatar-img${playerAvatar.slice(-1)}`);
  div.appendChild(elementPlayerAvatar);

  playerContainer.appendChild(div);
}

function createDesk(gameControl) {
  const deskContainer = catchElement("desk-container");
  const pileDeck = newElement("div", "pile-deck", null, deskContainer);
  pileDeck.innerText = gameControl.pileDeck.cards[
    gameControl.pileDeck.cards.length - 1
  ].cardName();
  pileDeck.style.color = "white";
  const tableDeck = newElement("div", "table-deck", null, deskContainer);
  pileDeck.addEventListener("click", (event) => {
    for (const player of gameControl.players) {
      if (player.turn) {
        const chosensCount = document.querySelectorAll(".chosen").length;
        if (chosensCount === 0) {
          alert("must choose a card");
          return;
        }
        if (gameControl.pileDeck.cards.length === 0) {
          alert("Canot draw card from an empty deck");
          return;
        } else {
          player.drawCard(gameControl.pileDeck.drawCard());
          const playerThrownCards = player.throwCards();
          gameControl.pileDeck.cards.push(...playerThrownCards);
          player.sumHand();
          renderBoard(gameControl);
          // WHY THE FUCK DOES SETTIMEOUT ZERO FIX IT????
          setTimeout(() => {
            switchTurn(gameControl);
            renderBoard(gameControl);
          }, 2000);
        }
      }
    }
  });

  tableDeck.addEventListener("click", (event) => {
    for (const player of gameControl.players) {
      if (player.turn) {
        const chosensCount = document.querySelectorAll(".chosen").length;
        if (chosensCount === 0) {
          alert("must choose a card");
          return;
        }
        if (gameControl.tableDeck.cards.length === 0) {
          alert("Canot draw card from an empty deck");
          return;
        }
        gameControl.pileDeck.cards.push(...player.throwCards());
        player.drawCard(gameControl.tableDeck.drawCard());
        player.sumHand();
        renderBoard(gameControl);
        // WHY THE FUCK DOES SETTIMEOUT ZERO FIX IT????
        setTimeout(() => {
          switchTurn(gameControl);
          renderBoard(gameControl);
        }, 2000);
      }
    }
  });
}

function renderBoard(gameControl) {
  const deskContainer = document.getElementById("desk-container");
  // Reminder for security problem.
  deskContainer.innerHTML = "";
  const yanivButton = newElement("button", null, null, deskContainer, null);
  const players = gameControl.players;
  const playerPositions = createPlayerPositions(players);
  for (let index = 0; index < players.length; index++) {
    createPlayerDiv(
      players[index],
      playerPositions[index],
      yanivButton,
      gameControl
    );
  }
  createDesk(gameControl);
}

function createPlayerDiv(player, playerPosition, yanivButton, gameControl) {
  const playerId = player.id;
  const playerName = player.name;
  const playerAvatar = player.avatar;
  const playerScore = player.score;
  const playerDeck = player.playerDeck;
  const playerCardsSum = player.cardsSum;

  const deskContainer = catchElement("desk-container");

  const playerContainer = newElement("div", "player-container", null, deskContainer);
  playerContainer.classList.add(playerPosition);

  const playerProfile = newElement("div", "player-profile", null, playerContainer);
  newElement("span", "name-span", playerName, playerProfile);
  newElement("span", `avatar-img${playerAvatar.slice(-1)}`, null, playerProfile);
  newElement("span", "score-span", playerScore, playerProfile);
  newElement("span", "id-span", playerId, playerContainer);

  // display only cards of the player that has the turn
  if (player.turn === true) {
    // if (playerCardsSum <= 7) {
    if (playerCardsSum <= 100) {
      // yanivButton.classList.remove('yaniv-before-button');
      yanivButton.classList.add("yaniv");
      yanivButton.addEventListener("click", () => {
        gameControl.yanivDeclaration = player;
        // console.log(player.name);
        yanivListener(gameControl);
      });
    } else {
      // yanivButton.classList.remove('yaniv');
      yanivButton.classList.add("yaniv-before-button");
    }
    newElement('span', 'cards-sum-span', playerCardsSum, playerContainer);
    const playerCards = newElement("div", "player-deck", null, playerContainer);
    for (let card of playerDeck) {
      const newCardElement = document.createElement("img");
      newCardElement.setAttribute(
        "src",
        `./assets/cards/${card.cardName()}.png`
      );
      newCardElement.classList.add("player-card");
      newCardElement.addEventListener('click', (e) => {
        if (checkValidChoose(card, playerDeck)) {
          card.chooseToggle(newCardElement);
        }
      });
      playerCards.append(newCardElement);
    }
  }
}

// function sort(arr) {
//   const newarr = [];
//   for (let i=0 ; i++ ; i<arr.length) {
//      if(arr.lenght)
//   }
// }
// update scoretable with total score and current round score
// doenst concider yaniv and asaf

//winer
// asaf
//cardsum
function updateScoreTable(gameControl) {
  const players = gameControl.players;
  const scoreTable = gameControl.scoreTable;

  for (const player of players) {
    player.score += player.cardsSum;
    scoreTable.total[player.name] = player.score;
    scoreTable.currentRound[player.name] = player.cardsSum;
  }
}



// sets the board to a new round
function newRoundDealing(gameControl) {
  if (JSON.stringify(gameControl) === JSON.stringify({})) {
    const players = [];
    const deck = new TableDeck();
    deck.shuffle();
    const pileDeck = new PileDeck();
    pileDeck.cards.push(deck.drawCard());
    gameControl = {
      tableDeck: deck,
      pileDeck: pileDeck,
      players: players,
      scoreTable: {
        total: {},
        currentRound: {},
      },
    };
    return gameControl;
  } else {
    const deck = new TableDeck();
    deck.shuffle();
    const pileDeck = new PileDeck();
    pileDeck.cards.push(deck.drawCard());
    gameControl.tableDeck = deck;
    gameControl.pileDeck = pileDeck;
    for (const player of gameControl.players) {
      player.playerDeck = gameControl.tableDeck.deal5Cards();
      player.sumHand();
    }
    renderBoard(gameControl);
  }
}

function createPlayerPositions(players) {
  const possiblePositions = [
    "current-player",
    "left-player",
    "top-player",
    "right-player",
  ];
  if (players.length === 2) {
    return [possiblePositions[0], possiblePositions[2]];
  } else if (players.length === 3) {
    return [possiblePositions[0], possiblePositions[1], possiblePositions[2]];
  }
  return possiblePositions;
}

function renderScoreTable(gameControl) {
  const deskContainer = document.getElementById("desk-container");
  const players = gameControl.players;
  const div = newElement("div", null, null, deskContainer, "score-table-div");
  console.log(gameControl.scoreTable);
  for (const player of players) {
    const playerTotalScore = gameControl.scoreTable.total[player.name];
    const playerRoundScore = gameControl.scoreTable.currentRound[player.name];
    newElement('h1', 'total-element', `${player.name} total score: ${playerTotalScore}`, div, null);
    newElement('h1', 'current-element', `${player.name} current score: ${playerRoundScore}`, div, null);
  }
}

function yanivRender(gameControl) {
  // REVEAL EVERYONE CARDS
  // remove event listeners player deck and desks deck
  //
  const players = gameControl.players;
  for (const player of players) {
    player.turn = true;
  }

  renderBoard(gameControl);
  for (const player of players) {
    player.turn = false;
  }
}

// const winner: player = updateScoreTable(gameControl)

function setNewFirstTurn(gameControl) {
  const winner = gameControl.yanivDeclaration;
  winner.turn = true;
}

export { addPlayer, getCheckedAvatar, renderWelcomePagePlayers, guessACard, startGame, createDesk, renderBoard, createPlayerDiv, updateScoreTable, newRoundDealing };
// chosenCards[0].rank is not a property (chosen cards[0] is an element)

function checkValidChoose(card, playerDeck) {
  // check if the click was on a chosen card
  if (card.chosen) {
    return true;
  }
  const chosenCards = playerDeck.filter((card) => {
    return card.chosen;
  });

  // const set = asyncValidationCase(playerDeck);
  // if (set) {
  //   console.log(set);
  //   console.log(card);
  //   // create a flag maybe;
  //   if (set.includes(card)) {
  //     for (const chosenCard of chosenCards) {
  //       if (set.includes(chosenCard)) {
  //         continue;
  //       } else if (!set.includes(chosenCard)) {
  //         break;
  //       }
  //       else {
  //       }
  //       return true;
  //     }
  //   }
  // }


  // [2, 3, 4]
  // 3, 4
  // card
  // if chosenCards are in set
  // if card is in set

  // if (card.suit === )

  // here to filter the chosen cards from player deck

  if (chosenCards.length === 0) {
    return true;
  } else if (chosenCards.length === 1) {
    // console.log("1 card selected");
    return validationCaseOne(chosenCards, card);
  } else if (chosenCards.length === 2) {
    // console.log("2 card selected");
    return validationCaseTwo(chosenCards, card);
  } else if (chosenCards.length === 3) {
    // console.log("3 card selected");
    return validationCaseThree(chosenCards, card);
  } else if (chosenCards.length === 4) {
    // console.log("4 card selected");
    return validationCaseFour(chosenCards, card);
  } else {
    // console.log("else selected");
  }
}
// true
// - same id
// - continue to be consectuive numbers with the same sign
