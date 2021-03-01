function hidWelcomePage() {
  const form = catchElement("form-background");
  form.style.display = "none";
}

function randomOrderArray(arr) {
  let newArr = [];
  while (arr.length > 0) {
    let index = Number(Math.round(Math.random() * (arr.length - 1)));
    newArr.push(...arr.splice(index, 1));
  }
  return newArr;
}

function catchElement(id) {
  const x = document.getElementById(id);
  return x;
}

function newElement(element, className, content, appendTo, id) {
  const x = document.createElement(element);
  x.classList.add(className);
  x.setAttribute("id", id);
  x.innerText = content;
  appendTo.append(x);
  return x;
}

// messing around
function guessACard() {
  const deck = new TableDeck();
  deck.shuffle();
  const player = new Player([], "Danks", "male");

  player.drawTableCard(deck.drawCard());
  console.log(player.playerDeck[0]);
}

// returns the checked avatar
function getCheckedAvatar() {
  const allAvatars = document.getElementsByName("avatar");
  for (const avatar of allAvatars) {
    if (avatar.checked) {
      return avatar.value;
    }
  }
}

function switchTurn(gameControl) {
  const players = gameControl.players;
  const playerTurnIndex = players.findIndex((player) => { return player.turn === true });
  players[playerTurnIndex].turn = false;
  if (playerTurnIndex === players.length - 1) {
    players[0].turn = true;
  } else {
    players[playerTurnIndex + 1].turn = true;
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

function updatePlayersCardsCounter(gameControl) {
  const players = gameControl.players;
  for (const player of players) {
    player.sumHand();
  }
}

function validationCaseOne(chosenCards, card) {
  // same rank
  if (card.rank === chosenCards[0].rank) {
    return true;
    // consecutive numbers with the same sign
  } else if ((
    card.id === chosenCards[0].id + 1 ||
    card.id === chosenCards[0].id - 1) &&
    card.suit === chosenCards[0].suit) {
    return true;
  } else {
    return false;
  }
}
// // true
//   - same id
//   - continue to be consectuive numbers with the same sign

function validationCaseTwo(chosenCards, card) {
  // if the user clicked on two cards with the same number
  if (chosenCards[0].rank === chosenCards[1].rank) {
    // if the card is the same number as the other two chosens
    if (card.rank === chosenCards[0].rank) {
      return true;
    } else {
      return false;
    }
    // the two chosen cards are same suit and consecutive
  } else {
    // card has the same suit as the other two
    if (card.suit === chosenCards[0].suit) {
      // card is continuing consecutive numbers
      if (
        card.id === chosenCards[0].id + 1 ||
        card.id === chosenCards[0].id - 1 ||
        card.id === chosenCards[1].id + 1 ||
        card.id === chosenCards[1].id - 1
      ) {
        return true;
      }
    }
    return false;
  }

}

// true
// - same id
// - continue to be consectuive numbers with the same sign

function validationCaseThree(chosenCards, card) {
  // enough to know that the third one is also equal 
  if (chosenCards[0].rank === chosenCards[1].rank) {
    if (card.rank === chosenCards[0].rank) {
      return true;
    } else {
      return false;
    }
    // the cards selected are for sure a set of consecutive cards
  } else {
    // check if the card has the same suit
    if (card.suit === chosenCards[0].suit) {
      if (
        card.id === chosenCards[0].id + 1 ||
        card.id === chosenCards[0].id - 1 ||
        card.id === chosenCards[1].id + 1 ||
        card.id === chosenCards[1].id - 1 ||
        card.id === chosenCards[2].id + 1 ||
        card.id === chosenCards[2].id - 1
      ) {
        return true;
      }
    }
    return false;
  }
}
// true
// - same id
// - continue to be consectuive numbers with the same sign

function validationCaseFour(chosenCards, card) {
  // the chosen cards must be consectiutive numbers with the same sign
  if (card.suit === chosenCards[0].suit) {
    if (
      card.id === chosenCards[0].id + 1 ||
      card.id === chosenCards[0].id - 1 ||
      card.id === chosenCards[1].id + 1 ||
      card.id === chosenCards[1].id - 1 ||
      card.id === chosenCards[2].id + 1 ||
      card.id === chosenCards[2].id - 1 ||
      card.id === chosenCards[3].id + 1 ||
      card.id === chosenCards[3].id - 1
    ) {
      return true;
    }
  } return false;
}

// Need to figure out how to get the playerDeck
// need to add property to card that override chosen
function asyncValidationCase(playerDeck, card) {
  const setArray = getArrayWithHighestAppearance(playerDeck);
  // no sufficient suit apearances
  if (!setArray) {
    return;
    // array of cards that can possibly make a set
  } else {
    // Checks that for every number in the array there is a consecutive number

    setArray.sort((a, b) => {
      return a.id - b.id;
    });
    let temp = [];
    // [1,0,3,4,7]

    for (let index = 0; index < setArray.length; index++) {
      if (index === setArray.length - 2 && setArray[index] === setArray[index + 1] - 1) {
        temp.push(setArray[index].id);
        temp.push(setArray[index + 1].id);
        break;
      }
      else if (setArray[index].id === setArray[index + 1].id - 1) {
        temp.push(setArray[index].id);
      }
      else {
        if (temp.length < 3) {
          temp = [];
        }
        temp.push(setArray[index].id);
      }
      return temp;

    }
    // make this cards override prop make sure to remove the overide
  }
}

// returns array with the highest suit appearances or -1 it didnt find one with more than 3 apearances
function getArrayWithHighestAppearance(playerDeck) {
  const suits = ['heart', 'diamond', 'club', 'spade'];
  for (const suit of suits) {
    const suitArr = playerDeck.filter(card => card.suit === suit);
    if (suitArr.length > 2) return suitArr;

  }
  // const jokers = 
  return false;
}

export {
  guessACard,
  newElement,
  catchElement,
  randomOrderArray,
  hidWelcomePage,
  getCheckedAvatar,
  createPlayerPositions,
  switchTurn,
  updatePlayersCardsCounter,
  validationCaseOne,
  validationCaseTwo,
  validationCaseThree,
  validationCaseFour,
  asyncValidationCase,
  getArrayWithHighestAppearance
};

