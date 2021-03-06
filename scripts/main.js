console.log('main js up!')

// winning matrix
const winningMoves = [
    [0, 1, 2],[3, 4, 5],[6, 7, 8],
    [0, 3, 6],[1, 4, 7],[2, 5, 8],
    [0, 4, 8],[2, 4, 6]
]

// can keep track separately or sum up wins and draw from 
// players
let gameRounds = 0
// gameRounds = p1WinCount + p2WinCount + drawCount

let p1WinCount = 0
let p2WinCount = 0
let drawCount = 0


// maximum number of plays per game/round
const MAX_PLAY_MOVES = 9

const playerOption = ['X', 'O']
let player1 = ''
let player2 = ''
let playerText = 'Player 1'

let player1GameName = 'Player 1'
let player2GameName = 'Player 2'

let gameOver = false
let drawGame = false

// this is assigned X or O dependending on 
// whether current player is using X or O
let currentPlayer = ''

// should not be more that 9
let boardMoves = []

// keep track of the number of plays or validation
let validateCount = 0

// get all boxes
let allBoxes = document.querySelectorAll('.box')

const player1Display = document.querySelector('#player-one')
const player2Display = document.querySelector('#player-two')

function init() {
    console.log('Welcome to Tic Tac Toe!')

    // Attaching event listener to button
    document.querySelector('#restart')
    .addEventListener('click', resetPlayBoard)

    // Trigger the click event for reset play board
    document.querySelector('#restart').click()

    // call to determine X or O for players
    randomSelectPlayer()

    // set count values to zero 
    setDefaultScoresToZero()
}

// Call the initialization function
init()

// function to reset game board and set all boxes to empty
function resetPlayBoard(event) {
    event.preventDefault();
    console.log('Game board reset!')

    allBoxes.forEach(box => {
        // set all boxes to emoji 
        box.innerHTML = '&#129313;'
        box.disabled = false
    })

    confetti.stop()

    // call to refresh player style on page
    refreshPlayer()

    validateCount = 0
    playerText = player1GameName

    gameOver = false
    drawGame = false
    // setGameMessage('')
    setGameMessage(`${playerText}'s turn!`)
    document.querySelector('#winner').style.display = 'none'

    boardMoves = []
    randomSelectPlayer()
}


// reset style on player buttons 
function refreshPlayer() {
    player1Display.classList.add('active')
    player1Display.disabled = false
    
    player2Display.disabled = false
}

let resetButton = document.querySelector('#restart')

// add Event Listener button
resetButton.addEventListener('click', resetPlayBoard)

// determine X or O for player1 and player2
function randomSelectPlayer() {
    let idx = getRandomIndex(playerOption.length)

    if (idx === 0) {
        player1 = playerOption[0] 
        player2 = playerOption[1]
    } else {
        player1 = playerOption[1]
        player2 = playerOption[0]
    }
    
    console.log(`${player1GameName}: ${player1}  <==> ${player2GameName}: ${player2}`)
    // console.log(`player1: ${player1}  <==> player2: ${player2} `)
    
    // player1 is current player when game starts/restarted
    currentPlayer = player1
    highlightActivePlayer()

    // assign X and O to player1 and player2
    player1Display.innerHTML = `${player1GameName}: ${player1}`
    player2Display.innerHTML = `${player2GameName}: ${player2}`
}

// Based on the max length of the Array. Return a random items index
// within the Array's length.
function getRandomIndex(maxLength) {
    return Math.floor(Math.random() * Math.floor(maxLength));
}

// selectBox: determine box selected
function selectBox() {

    const mainContainer = document.querySelector('.container')
    const allBoxes = document.querySelectorAll('.box')

    mainContainer.addEventListener('click', (event) => {

        // call button click sound effect
        buttonPush.play()

      if (event.target.classList.contains('box')) {
        allBoxes.forEach((box, index) => {
          if (box === event.target) {
            //   console.log(`elm: ${box.value}`)

            // set the button to currentPlayer - 'X' or 'O'
            event.target.innerHTML = currentPlayer
            // console.log(event.target.value)
            // disable box after it is selected
            event.target.disabled = true

            // add X or O to box moves array
            // this indicates the selected indices
            boardMoves[index] = currentPlayer

            // call validate moves after each play
            validateMoves(playerText)

            // switch player to next
            switchPlayer()

            // save to localStorage
            // saveToLocalStorage()
          }
        })
      } else {
        console.log('click on a box! \n watch your cursor player!')
      }
    })
}

selectBox()

// switch current player between player1 to player2 and vice versa
function switchPlayer() {
    // console.log('In switchPlayer')
    if (currentPlayer === player1) {
        currentPlayer = player2
        playerText = player2GameName
    } else {
        currentPlayer = player1
        playerText = player1GameName
    }

    highlightActivePlayer()
}

// highlight current active player
function highlightActivePlayer() {
    if(currentPlayer === player1) {
        player1Display.classList.add('active')
        player2Display.classList.remove('active')
    } else {
        player1Display.classList.remove('active')
        player2Display.classList.add('active')
    }

    // check if game is over before displaying message
    gameOver || drawGame ? '' : setGameMessage(`${playerText}'s turn!`)
}

// method to validate every move
// compares winning scenario array with current moves 
// by both players. If there is a winner return otherwise
// keep playing 
function validateMoves(validatePlayer) {
    validateCount++

    // keep track if there is a winner or not
    let winner = false

    // loop through winning moves array
    for (moves in winningMoves) {
        // console.log(winningMoves[moves])
        const move = winningMoves[moves]
        // console.log('first ' + boardMoves[move[0]])
        // console.log('second ' + boardMoves[move[1]])
        // console.log('third ' + boardMoves[move[2]])

        // compare board move values board move to
        // the winning scenarios predefined in winningMoves
        // if any row  of 3 in boardMoves has the same X or O
        // it is the winner
        let first = boardMoves[move[0]]
        let second = boardMoves[move[1]]
        let third = boardMoves[move[2]]

        // check none of the value is not undefined
        if(first !== undefined || second !== undefined ||third !== undefined) {
            if(first === second && first === third) {
                winner = true;
                gameOver = true
                // gameRounds++
                confetti.start()
                winWin.play()

                // call to disable all boxes if there is a winner 
                disableBoxes()

                // set win message 
                setGameMessage(`${validatePlayer} is the winner! &#127881; &#127882;`)
                
                // count wins for different players
                winCounts(validatePlayer)
                // remove active style class from player buttons 
                removeActiveClass()

                return
            }
        } else {
            // there is no winner continue playing 
            winner = false
            continue
        }
        // console.log(`validate count: ${validateCount}`)
    }

    // if no winner and play count is equal to max
    // the game is a draw
    if(!winner && validateCount === MAX_PLAY_MOVES) {
        console.log('It is a draw')
        drawGame = true
        // drawCount++
        // gameRounds++
        winCounts("draw")

        // send draw message 
        setGameMessage('It is the DRAW!')

        // remove active style class from player buttons 
        removeActiveClass()
    }
    
    // call to disable player button when game is in progress
    disablePlayerbutton()    
}

// disable all boxes on board
function disableBoxes() {
    allBoxes.forEach(box => {
        box.disabled = true
    })
}

// show/attach message win, lose, draw to element
// hide and show relevant div
function setGameMessage(message) {
    let nextPlay = document.querySelector('#nextPlayer')
    let winner = document.querySelector('#winner')
    if (gameOver || drawGame) {
        winner.style.display = 'block'
        winner.innerHTML = message
        nextPlay.style.display = 'none'
    } 
    else {
        nextPlay.innerHTML = message
        nextPlay.style.display = 'block'
    }
}

// remove active class from both players
function removeActiveClass() {
    // console.log('In removeActiveClass')
    document.querySelector('#player-one').classList.remove('active')
    document.querySelectorAll('.player').forEach(player => {
        player.disabled = true
        player.classList.remove('active')
    })
}

// keep track of wins and draws and display on page
function winCounts(player) {
    console.log(` winner ${player}`)
    gameRounds++

    if(!drawGame) {
        player === player1GameName ? p1WinCount++ : p2WinCount++
    } else {
        drawCount++
    }
    
    setCountValues()
}

let resetScoreButton = document.querySelector('#reScore')

// add Event Listener to reset score button
resetScoreButton.addEventListener('click', resetScore)

// set all counts to zero 0
function resetScore(event) {
    console.log('reset all scores!')
    // call to set player names to default
    resetPlayerNames()

    // call to initialize board
    init()

    // set display values
    setCountValues()
}

function setDefaultScoresToZero() {
    gameRounds = 0
    p1WinCount = 0
    p2WinCount = 0
    drawCount = 0
}

// set count values on html element
// Used values passed or global count values
function setCountValues(gameRoundVal, p1WinCountVal, p2WinCountVal, drawCountVal) {
    if (gameRoundVal && p1WinCountVal && p2WinCountVal && drawCountVal) {
        console.log('using values passed to method!')
        document.querySelector('#span-games').innerText = gameRoundVal;
        document.querySelector('#span-p1').innerText = `${p1WinCountVal}`;
        document.querySelector('#span-p2').innerText = `${p2WinCountVal}`;
        document.querySelector('#span-draw').innerText = `${drawCountVal}`;
    } else {
        console.log('using global values!')
        document.querySelector('#span-games').innerText = gameRounds;
        document.querySelector('#span-p1').innerText = `${p1WinCount}`;
        document.querySelector('#span-p2').innerText = `${p2WinCount}`;
        document.querySelector('#span-draw').innerText = `${drawCount}`;
    }

    // call to reset player names to default
    // resetPlayerNames()
}

// reset player names to default
function resetPlayerNames() {
    // reset player names
    player1GameName = 'Player 1'
    player2GameName = 'Player 2'
}

// create button click sound effect 
var buttonPush = new Audio()
buttonPush.src = '/tic-tac-toe/Tiny-Button-Push.mp3'

// winners song 
var winWin = new Audio()
winWin.src = '/tic-tac-toe/all-i-do-is-win.mp3'

const playerButtons = document.querySelectorAll('.player')

// add Event Listener to all buttons 
playerButtons.forEach(button => {
    button.addEventListener('click', displaySettings)
})

function displaySettings(event) {
    console.log(`buttons ${event.target.innerHTML}`);
    console.log(`buttons ${event.target.id}`);
    document.querySelector('.overlay').style.display = 'block'
    document.querySelector('.modal').style.display = 'block'
    profileChange = event.target.id

    event.target.id === 'player-one'
}

let profileChange = ''
// display settings page/div
function buttonSettings(event) {
    console.log(`buttons ${event.target.innerHTML}`);
    let button = event.target.value

    let profile = document.querySelector('#profile').value
    console.log(`profile => ${profile}`);

    // check if input is empty or not 
    // if input is empty just close modal 
    if(profile === '' || profile === undefined || profile === null) {
        console.log(`profile is empty!`);
        hideOverlayModal()
    } else {

        if(profileChange === 'player-one') {
            player1GameName = profile
            document.querySelector(`#${profileChange}`).textContent = `${profile}: ${player1}`
        } else {
            player2GameName = profile
            document.querySelector(`#${profileChange}`).textContent = `${profile}: ${player2}`
        }
        setGameMessage(`${player1GameName}'s turn!`)
    
        // call to hide settings
        hideOverlayModal()
    }

}

const setSubmitButton = document.querySelector('#setSubmit')
setSubmitButton.addEventListener('click', buttonSettings)

// hide overlay and modal 
function hideOverlayModal() {
    document.querySelector('#profile').value = ''
    document.querySelector('.overlay').style.display = 'none'
    document.querySelector('.modal').style.display = 'none'
}

// cancel and hide player profile modal & overlay
const setCancelButton = document.querySelector('#setCancel')
setCancelButton.addEventListener('click', hideOverlayModal)

// disable player button when game started.
// player should not be able to update name 
// after game starts
function disablePlayerbutton() {
    // console.log('=> in disablePlayerbutton')
    if (validateCount > 0) {
        playerButtons.forEach(player => {
            player.disabled = true
        })
    } else {
        playerButtons.forEach(player => {
            player.disabled = false
        })
    }
}

disablePlayerbutton()


/**
 * Work in Progress
 * below code not active
 */
// create object to store in localStorage
// const GameObject = {

//     player1Name: '',
//     player2Name: '',

//     currentPlayer: currentPlayer,

//     p1WinCount: p1WinCount,
//     p2WinCount: p2WinCount,
//     drawCount: drawCount,

//     boardMoves: []// JSON.stringify(boardMoves)
// }

// save items to local storage 
function saveToLocalStorage() {
    localStorage.setItem('player1GameName', player1GameName);
    localStorage.setItem('player2GameName', player2GameName);
    localStorage.setItem('currentPlayer', currentPlayer);

    localStorage.setItem('player1', player1);
    localStorage.setItem('player2', player2);

    localStorage.setItem('gameRounds', gameRounds);
    localStorage.setItem('p1WinCount', p1WinCount);
    localStorage.setItem('p2WinCount', p2WinCount);
    localStorage.setItem('drawCount', drawCount);
    
    localStorage.setItem('boardMoves', JSON.stringify(boardMoves));
}

// get items from LocalStorage
function getItemsLocalStorage() {
    // var storedArray = ''
    // for(let i=0; i<localStorage.length; i++) {
    //     let key = localStorage.key(i)
    //     console.log(`${key} => ${localStorage.getItem(key)}`)
    //     if(key === "boardMoves") {
    //         storedArray = localStorage.getItem(key)
    //     }
    //     console.log(`storedArray: ${storedArray}`)
    // }

    player1GameName = localStorage.getItem('player1GameName');
    player2GameName = localStorage.getItem('player2GameName');
    player1 = localStorage.getItem('player1');
    player2 = localStorage.getItem('player2');

    document.querySelector(`#player-one`).textContent = `${player1GameName}: ${player1}`
    document.querySelector(`#player-two`).textContent = `${player2GameName}: ${player2}`
    
    currentPlayer = localStorage.getItem('currentPlayer');

    gameRounds = localStorage.getItem('gameRounds');
    p1WinCount = localStorage.getItem('p1WinCount');
    p2WinCount = localStorage.getItem('p2WinCount');
    drawCount = localStorage.getItem('drawCount');
    setCountValues(gameRounds, p1WinCount, p2WinCount, drawCount)

    let boardMovesArray = localStorage.getItem("boardMoves");
    boardMoves = JSON.parse(boardMovesArray);

    console.log(`boardMoves: ${boardMoves}`)
}

// delete everything in localStorage
function refreshLocalStorage() {
    localStorage.clear()
    console.log('Local Storage cleared!')
}

// get Local Storage
const getStorageButton = document.querySelector('#getLocalStorage')
getStorageButton.addEventListener('click', getItemsLocalStorage)

// clear Local Storage
const clearStorageButton = document.querySelector('#clearLocalStorage')
clearStorageButton.addEventListener('click', refreshLocalStorage)
