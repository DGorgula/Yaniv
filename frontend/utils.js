import { Deck, Player, PileDeck, TableDeck, Card } from './export-tomain.js';
import { hidWelcomePage, randomOrderArray, catchElement, newElement, guessACard, getCheckedAvatar, switchTurn, updatePlayersCardsCounter } from './assistence-functions.js';

// Event Listeners:

function yanivListener(gameControl) {
  yanivRender(gameControl);///reveld cards , 
  const winner = updateScoreTable(gameControl);// how is the winner , giving score , update
  renderScoreTable(gameControl); /// present the winner and the table
  // setNewFirstTurn(gameControl, winner);// first player turn 
  setTimeout(() => {
    newRoundDealing(gameControl);//sets the desk for new round
    updatePlayersCardsCounter(gameControl);
  }, 7000);


}

function theWinnerIs(gameControl) {
  const players = gameControl.players;
  let lowerScore = 100;
  // for (player of players) {
  //   if 
  // }

}


function startGame(gameControl) {
  hidWelcomePage();
  gameControl.players = randomOrderArray(gameControl.players);
  gameControl.players[0].turn = true;
  renderBoard(gameControl);
}

function addPlayer(event, gameControl, addPlayerButton, startGameButton) {
  const nameInput = document.getElementById('player-name');
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
  }
  else if (players.length === 4) {
    addPlayerButton.hidden = true;
  }
}

//   rendering functions :
// =========================
// render added players to the welcome page
function renderWelcomePagePlayers(player) {
  const playerContainer = document.getElementById('players-container');
  const playerName = player.name;
  const playerAvatar = player.avatar;
  const playerId = player.id;

  const div = document.createElement('div');
  div.classList.add("welcome-player-div");

  const elemnentIndex = document.createElement('span');
  elemnentIndex.innerText = playerId;
  div.appendChild(elemnentIndex);

  const elementPlayerName = document.createElement('span');
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
  pileDeck.innerText = gameControl.pileDeck.cards[gameControl.pileDeck.cards.length - 1].cardName();
  pileDeck.style.color = 'white';
  const tableDeck = newElement("div", "table-deck", null, deskContainer);
  pileDeck.addEventListener("click", (event) => {
    for (const player of gameControl.players) {
      if (player.turn) {
        const chosensCount = document.querySelectorAll('.chosen').length;
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

        const chosensCount = document.querySelectorAll('.chosen').length;
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
  const deskContainer = document.getElementById('desk-container');
  // Reminder for security problem.
  deskContainer.innerHTML = '';
  const yanivButton = newElement('button', null, null, deskContainer, null);
  const players = gameControl.players;
  const playerPositions = createPlayerPositions(players);
  for (let index = 0; index < players.length; index++) {
    createPlayerDiv(players[index], playerPositions[index], yanivButton, gameControl);
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

  const deskContainer = catchElement('desk-container');

  const playerContainer = newElement('div', 'player-container', null, deskContainer);
  playerContainer.classList.add(playerPosition);
  newElement('span', 'cards-sum-span', playerCardsSum, playerContainer);

  // display only cards of the player that has the turn
  if (player.turn === true) {
    if (playerCardsSum <= 7) {
      // if (playerCardsSum <= 100) {
      // yanivButton.classList.remove('yaniv-before-button');
      yanivButton.classList.add('yaniv');
      yanivButton.addEventListener('click', () => {
        player.Yaniv(gameControl);
        yanivListener(gameControl);
      });
    } else {
      // yanivButton.classList.remove('yaniv');
      yanivButton.classList.add('yaniv-before-button');
    }
    const playerCards = newElement('div', 'player-deck', null, playerContainer);
    for (let card of playerDeck) {
      const newCardElement = document.createElement("img");
      newCardElement.setAttribute(
        "src",
        `./assets/cards/${card.cardName()}.png`
      );
      newCardElement.classList.add("player-card");
      newCardElement.addEventListener('click', (e) => {
        card.chooseToggle(newCardElement);
      });
      playerCards.append(newCardElement);
    }
  }

  const playerProfile = newElement('div', 'player-profile', null, playerContainer)
  newElement('span', 'name-span', playerName, playerProfile);
  newElement("span", `avatar-img${playerAvatar.slice(-1)}`, null, playerProfile);
  newElement('span', 'score-span', playerScore, playerProfile);
  newElement('span', 'id-span', playerId, playerContainer);
}

// update scoretable with total score and current round score
// doenst concider yaniv and asaf
function updateScoreTable(gameControl) {
  const players = gameControl.players;
  const scoreTable = gameControl.scoreTable;
  const roundScore = {};
  for (const player of players) {
    roundScore[player.name] = player.cardsSum;

  }
  // const winner: player = theWinnerIs(gameControl);





  for (const player of players) {
    scoreTable.currentRound[player.name] = player.cardsSum;
    scoreTable.total[player.name] = player.score + player.cardsSum;
  }
  return scoreTable;
}

// resets the hand score of each player and sums it in his score property
function playersCalculateFinshedRound(players) {
  for (const player of players) {
    player.resetRoundScoreAndAddToScoreProp();
  }
}
//()
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
        currentRound: {}
      }
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
    }
    renderBoard(gameControl);
  }
}

function createPlayerPositions(players) {
  const possiblePositions = ['current-player', 'left-player', 'top-player', 'right-player']
  if (players.length === 2) {
    return [possiblePositions[0], possiblePositions[2]]
  } else if (players.length === 3) {
    return [possiblePositions[0], possiblePositions[1], possiblePositions[2]]
  }
  return possiblePositions;
}

function renderScoreTable(gameControl) {
  const deskContainer = document.getElementById('desk-container');
  const players = gameControl.players;
  const div = newElement('div', null, null, deskContainer, "score-table-div");
  console.log(gameControl.scoreTable);
  for (const player of players) {
    const playerTotalScore = gameControl.scoreTable.total[player.name];
    const playerRoundScore = gameControl.scoreTable.currentRound[player.name];
    const totalElement = newElement('h1', 'total-element', `${player.name} totaled of: ${playerTotalScore}`, div, null);
    const currentElement = newElement('h1', 'current-element', `${player.name} current: ${playerRoundScore}`, div, null);
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

  const deskContainer = document.getElementById('desk-container');
  deskContainer.innerHTML = '';
  const yanivButton = newElement('button', null, null, deskContainer, null);
  for (const player of players) {
    createPlayerDiv(player, player.position, yanivButton, gameControl);
  }
  createDesk(gameControl);
  for (const player of players) {
    player.turn = false;
  }



}


// const winner: player = updateScoreTable(gameControl)

function setNewFirstTurn(gameControl) {
  const players = gameControl.players;
  for (const player of players) {
    if (player.winner) {
      player.turn = true;
      player.winner = fulse;
    }
  }

}


export { addPlayer, getCheckedAvatar, renderWelcomePagePlayers, guessACard, startGame, createDesk, renderBoard, createPlayerDiv, updateScoreTable, playersCalculateFinshedRound, newRoundDealing };

