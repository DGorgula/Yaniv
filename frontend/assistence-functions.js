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


// returns all possible valid sets from the player deck
function allValidPossibleSets(playerDeck) {
  const setsCombinations = possibleSetCombinations(playerDeck);
  console.log(setsCombinations);
  if (!setsCombinations) {
    return;
  } else {
    const validSets = [];
    for (const set of setsCombinations) {
      const validSetArray = validSet(set);
      console.log(validSetArray);
      if (validSetArray) {
        validSets.push(validSetArray);
      }
    }
    console.log(validSets);
    return validSets;
  }
}

// returns a set only if valid, if not returns false
function validSet(setArray) {
  console.log(setArray);
  setArray.sort((a, b) => {
    return a.id - b.id;
  });
  // case one joker
  if (setArray[0] === 0 && setArray[1] !== 0) {
    setArray.sort((a, b) => { a - b })
    console.log(setArray, "first");
    for (let i = 1; i < setArray.length; i++) {
      let arr = setArray.slice(0);
      arr[0].id = arr[i].id + 1;
      return isValid(arr);
    }
    for (let i = 1; i < setArray.length; i++) {
      console.log(setArray, "second");
      let arr = setArray.slice(0);
      arr[0].id = arr[i].id - 1;
      return isValid(arr);
    }
  }
  // case two joker`s
  if (setArray[0] === 0 && setArray[1] == 0) {
  }
  // case no joker`s
  else {
    return isValid(setArray);
  }
}
// let jokerCounter = 0;
// console.log("after sort", setArray);


function isValid(setArray) {
  let validSetArray = [];
  // [1,0,3,4,7]
  for (let index = 0; index < setArray.length - 1; index++) {
    // pushes the last cell of setArry if part of consecutive numbers;
    if (index === setArray.length - 2 && setArray[index].id === setArray[index + 1].id - 1) {
      validSetArray.push(setArray[index]);
      validSetArray.push(setArray[index + 1]);
      console.log("1");
    }
    //  pushes the part of set Array if part of consecutive numbers;
    else if (setArray[index].id === setArray[index + 1].id - 1) {
      validSetArray.push(setArray[index]);
      console.log("2");
    }
    else {
      // pushes the last consecutive number and breaks if the length is sufficient 
      if (validSetArray.length > 1 && setArray[index - 1].id === setArray[index].id - 1) {
        validSetArray.push(setArray[index]);
        console.log("4");
        break;
      }
      // resets validSetArray if the sequence is smaller then 3
      else if (validSetArray.length < 3) {
        validSetArray = [];
        console.log("3");
      }

    }
  }
  return validSetArray.length > 2 ? validSetArray : false;
}





// returns array of arrays including all possible set combinations.
function possibleSetCombinations(playerDeck) {
  const suits = ['heart', 'diamond', 'club', 'spade'];
  const setsCombinations = [];

  const jokerArr = playerDeck.filter((card) => { return card.id === 0 });
  const jokerCounter = jokerArr.length;
  for (const suit of suits) {
    const suitArr = playerDeck.filter((card) => { return card.suit === suit });
    switch (jokerCounter) {
      case 2:
        if (suitArr.length > 0) {
          suitArr.push(...jokerArr);
          setsCombinations.push(suitArr);
        }
        break;
      case 1:
        if (suitArr.length > 1) {
          suitArr.push(...jokerArr);
          setsCombinations.push(suitArr);
        }
      default:
        if (suitArr.length > 2) {
          setsCombinations.push(suitArr);
        }
        break;
    }
  }

  return setsCombinations.length > 0 ? setsCombinations : false;
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
  validSet,
  allValidPossibleSets,
  possibleSetCombinations
};

