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
// function allValidPossibleSets(playerDeck) {
//   const setsCombinations = possibleSetCombinations(playerDeck);
//   console.log(setsCombinations);
//   if (!setsCombinations) {
//     return;
//   } else {
//     const validSets = [];
//     for (const set of setsCombinations) {
//       const validSetArray = validSet(set);
//       if (validSetArray) {
//         validSets.push(validSetArray);
//       }
//     }
//     console.log(validSets);
//     return validSets;
//   }
// }
// returns a set only if valid, if not returns false
function validSet(setArray) {
  const slicedArray = setArray.slice(0);
  slicedArray.sort((a, b) => {
    return a.id - b.id;
  });
  let jokerCounter = 0;
  for (const card of setArray) {
    console.log(card.id);
  }
  let validSetArray = [];
  // [1,0,3,4,7]
  for (let index = 0; index < setArray.length - 1; index++) {
    // counts the jokers
    if (setArray[index].id === 0) {
      jokerCounter++;
      console.log(jokerCounter);
      continue;
    }
    // pushes the last cell of setArry if part of consecutive numbers;
    else if (index === setArray.length - 2 && setArray[index].id === setArray[index + 1].id - 1) {
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
// returns a set only if valid, if not returns false
// function validSet(setArray) {
//   console.log(setArray);
//   setArray.sort((a, b) => {
//     return a.id - b.id;
//   });
//   let jokerCounter = 0;
//   console.log("after sort", setArray);
//   let validSetArray = [];
//   // [1,0,3,4,7]
//   for (let index = 0; index < setArray.length - 1; index++) {
//     // counts the jokers
//     if (setArray[index].id === 0) {
//       jokerCounter++;
//       console.log(jokerCounter);
//       continue;
//     }
//     // pushes the last cell of setArry if part of consecutive numbers;
//     else if (index === setArray.length - 2 && setArray[index].id === setArray[index + 1].id - 1) {
//       validSetArray.push(setArray[index]);
//       validSetArray.push(setArray[index + 1]);
//       console.log("1");
//     }
//     //  pushes the part of set Array if part of consecutive numbers;
//     else if (setArray[index].id === setArray[index + 1].id - 1) {
//       validSetArray.push(setArray[index]);
//       console.log("2");
//     }
//     else {
//       // pushes the last consecutive number and breaks if the length is sufficient 
//       if (validSetArray.length > 1 && setArray[index - 1].id === setArray[index].id - 1) {
//         validSetArray.push(setArray[index]);
//         console.log("4");
//         break;
//       }
//       // resets validSetArray if the sequence is smaller then 3
//       else if (validSetArray.length < 3) {
//         validSetArray = [];
//         console.log("3");
//       }

//     }
//   }
//   return validSetArray.length > 2 ? validSetArray : false;
// }

// LISTENNNNNNNNNNNN
//when fixing jockers make sure to add the jokers to the array 
// returns array of arrays including all possible set combinations.
// function possibleSetCombinations(playerDeck) {
//   const suits = ['heart', 'diamond', 'club', 'spade'];
//   const setsCombinations = [];

//   const jokerArr = playerDeck.filter((card) => { return card.id === 0 });
//   const jokerCounter = jokerArr.length;
//   for (const suit of suits) {
//     const suitArr = playerDeck.filter((card) => { return card.suit === suit });
//     switch (jokerCounter) {
//       case 2:
//         if (suitArr.length > 0) {
//           setsCombinations.push(suitArr);
//         }
//         break;
//       case 1:
//         if (suitArr.length > 1) {
//           setsCombinations.push(suitArr);
//         }
//       default:
//         if (suitArr.length > 2) {
//           setsCombinations.push(suitArr);
//         }
//         break;
//     }
//   }

//   return setsCombinations.length > 0 ? setsCombinations : false;
// }

// LISTENNNNNNNNNNNN
// doesnt get proper array.
//when fixing jockers make sure to add the jokers to the array 
// returns array of arrays including all possible set combinations.
function possibleSetCombinations(playerDeck) {
  const jokerArr = playerDeck.filter(card => card.value === 0);
  const jokerCounter = jokerArr.length;
  const suits = ['heart', 'diamond', 'club', 'spade'];
  const setsCombinations = [];
  for (const suit of suits) {
    const suitArr = playerDeck.filter((card) => { return card.suit === suit });
    switch (jokerCounter) {
      case 2:
        if (suitArr.length > 0) {
          console.log("case there are two jokers");
          suitArr.push(...jokerArr);
          setsCombinations.push(suitArr);
        }
        break;
      case 1:
        if (suitArr.length > 1) {
          console.log("case 1 joker");
          suitArr.push(...jokerArr);
          setsCombinations.push(suitArr);

        }
        break;
      default:
        if (suitArr.length > 2) {
          console.log("case there are no jokers");
          setsCombinations.push(suitArr);
        }
        break;
    }
  }

  return setsCombinations.length > 0 ? setsCombinations : false;
}
function allValidPossibleSets(playerDeck) {
  const jokerArr = playerDeck.filter((card) => { return card.value === 0 });
  const jokerCounter = jokerArr.length;
  const setsCombinations = possibleSetCombinations(playerDeck);
  if (!setsCombinations) {
    return;
  } else {
    const validSets = [];
    for (const set of setsCombinations) {
      // sort the set to get jokers first
      // Jokers id is 13 
      set.sort((a, b) => { return a.id - b.id });

      // case there are no jokers
      if (jokerCounter === 0) {
        const validSetArray = validSet(set);
        if (validSetArray) {
          validSets.push(validSetArray);
        }
      }
      // case there is one joker
      else if (jokerCounter === 1) {
        const cardsJokerFree = set.filter((card) => { return card.id !== 0 });
        const combinations = [];
        if (cardsJokerFree.length === 1) {
          combinations.push([...cardsJokerFree, ...jokerArr])
        }
        else if (cardsJokerFree.length === 2) {
          console.log(cardsJokerFree);
          if (cardsJokerFree[1].id - cardsJokerFree[0].id <= 2) {
            combinations.push([...cardsJokerFree, ...jokerArr])
          }
        }
        else if (cardsJokerFree.length === 3) {
          if ((cardsJokerFree[1].id - cardsJokerFree[0].id === 1 && cardsJokerFree[2].id - cardsJokerFree[1].id <= 2) ||
            cardsJokerFree[1].id - cardsJokerFree[0].id <= 2 && cardsJokerFree[2].id - cardsJokerFree[1].id === 1) {
            combinations.push([...cardsJokerFree, ...jokerArr]);
          }
        }
        else {
          const case3combinations = joker1Case3(cardsJokerFree, ...jokerArr);
          const case4combinations = joker1Case4(cardsJokerFree, ...jokerArr);
          const case5combinations = joker1Case5(cardsJokerFree, ...jokerArr);
          combinations.push(...case3combinations, ...case4combinations, ...case5combinations);
        }
        console.log(combinations);
        validSets.push(combinations);
      }
      else if (jokerCounter === 2) {
        const combinations = all2JokersPossibilites(set);
        console.log(combinations);
        validSets.push(...combinations);
      }
    }
    console.log(validSets);
    return validSets;
  }
}
function between2CardsPossibilities(array, jokers) {
  const allPossibilities = [];
  const first = array[0];
  const second = array[1];
  const third = array[2];

  if (second.id - first.id <= 3) {
    allPossibilities.push([...jokers, second, first]);
  }
  if (third.id - second.id <= 3) {
    allPossibilities.push([...jokers, third, second]);
  }

  return allPossibilities;
}

function between3CardsPossibilities(array, jokers) {
  const bigGap = array[2].id - array[0].id;
  if (bigGap <= 4) {
    return [...array, ...jokers];
  }
  return [];
}






function all2JokersPossibilites(playerDeck) {

  const allPossibilities = [];
  const jokers = playerDeck.filter((card) => {
    return card.id === 0;
  });
  const array = playerDeck.filter((card) => {
    return card.id !== 0;
  });

  switch (array.length) {
    case 1:
      allPossibilities.push([...jokers, ...array]);
      break;
    case 2:
      if (array[1].id - array[0].id <= 3) {
        allPossibilities.push([...jokers, ...array]);
      }
      break;
    case 3:
      allPossibilities.push(...between2CardsPossibilities(array, jokers));
      console.log(between3CardsPossibilities(array, jokers));
      allPossibilities.push(between3CardsPossibilities(array, jokers));
      break;
    default:
      break;
  }
  return allPossibilities;
}

function joker1Case3(playerDeck, joker) {
  console.log(playerDeck);
  const array = playerDeck.slice(0);

  const allPossibilities = [];

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[j].id - array[i].id === 2) {
        allPossibilities.push([array[j], array[i], joker]);
      }

    }
  }
  console.log(allPossibilities);
  return allPossibilities;
}


function joker1Case4(playerDeck, joker) {
  const array = playerDeck.slice(0);
  const allPossibilities = [];

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i + 1].id - array[i].id === 1) {
      if (array[i + 2] != null && array[i + 2].id - array[i + 1].id === 2) {
        allPossibilities.push(array[i], array[i + 1], array[i + 2], joker)
      }
      else if (array[i - 1] != null && array[i].id - array[i - 1].id === 2) {
        allPossibilities.push(array[i - 1], array[i], array[i + 1], joker)
      }
    }

  }



  return allPossibilities;
}

function joker1Case5(playerDeck, joker) {
  console.log(playerDeck);
  const array = playerDeck.slice(0);
  const allPossibilities = [];
  if (array[1].id - array[0].id === 1 && array[3].id - array[2].id === 1 && array[2].id - array[1].id === 2) {
    allPossibilities.push(...array, joker);
  }
  else if (array[1].id - array[0].id === 1) {
    allPossibilities.push(array[1], array[0], joker);
  }
  else if (array[3].id - array[2].id === 1) {
    allPossibilities.push(array[3], array[2], joker);
  }



  return allPossibilities;
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

