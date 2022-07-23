'use strict'
const BOMB = '💣'
const FLAG = '🏴‍☠️'
const EMPTY = ''
const HEART = '❤️'
const SMILEY ='😁'
const SMILEY2 ='😢'

const gLevels = [
    { SIZE: 4, MINES: 2 },
    { SIZE: 8, MINES: 12 },
    { SIZE: 12, MINES: 30 }
]

let gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var arrLives
var gBombs = []
var gCurrLevel
var gLives 
var countBombsAround
var gStartTimer 
var gameSmiley
var gMarkSafePlaceTime
var isOn
var gTimePassed 
var gMinesPressed
var gTimerText = document.querySelector('.timer') 
var gIntervalShowBombs
var gFirstClick
var gSafeButtonClicks 
var gBoard 
var gHeart
var gCanClick = true 
var gMines 
var gFlags  
var gClicks 
var gLevelOptions = document.querySelector('.game-level')
var gLevel = {SIZE: 4, MINES: 2}
var cellClickedCount = 0 
var message = document.querySelector('.message p')
var button = document.querySelector('.button')



function initGame(level = 0) {
    gCurrLevel = level
    gLevel = gLevels[level] 
    restoreSmiley()
    restoreLives()
    if (level > 0) {
        printLives(3)
    }
    else {
        printLives(0)
    }
    gSafeButtonClicks = 3
    gHeart = 3
    gClicks = 0
    isOn = true
    message.innerText = ''
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    var elSelectSafeButton = document.querySelector('.safe-button span')
    var elSelectSafeButton2 = document.querySelector('.safe-button button')
    elSelectSafeButton.innerText = gSafeButtonClicks
    elSelectSafeButton2.style.background = '#27ae60'
    gBombs = []
    gFlags = []
    gMines = []
    gFirstClick = {}
    clearInterval(gTimePassed)
    gTimerText.innerText = 0
    gMinesPressed = 0
    gBoard = buildBoard()
    console.log(gBoard)
    renderBoard(gBoard)
    console.log(getMinesIndexs())
}

function buildBoard() {
    var board = createMatx(gLevel.SIZE,gLevel.SIZE)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false, isSafe: false, isFlag: false, element:'' }

        } 
    }

    return board
}

function setMinesNegsCount(board) {
    for(var i=0; i<board.length;i++){
        for(var j = 0 ; j<board[0].length;j++){
            for(var k = i-1; k<=i+1;k++){
                if(k<0 || k>= board.length) continue
                for(var n= j-1;n<= j+1;n++){
                    if(n<0 || n>= board[0].length) continue
                    if(n === i && k===j) continue
                    if(board[k][n].isMine) board[i][j].minesAroundCount++
                }
            }
            if (board[i][j].minesAroundCount === 0) {
                board[i][j].element = ''
                board[i][j].minesAroundCount = ''
            }
        }
    }    
}

function renderBoard(board) {
    var curretCell = board[0][0]
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML+= '<tr>\n'
        for (var j = 0; !curretCell.isMarked && j < board[0].length; j++) {
            curretCell = board[i][j]
            strHTML += `\t<td class="cell-${i}-${j}" oncontextmenu="cellClicked(this,${i}, ${j}, event)" onclick="cellClicked(this,${i}, ${j}, event)" >\n`
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

document, addEventListener('contextmenu', (event) => {
    event.preventDefault()
})

function cellClicked(elCell, i, j, ev) {
    if (ev.which === 3) {
        if (gBoard[i][j].isMarked) return
        // toggle the flag off
        if (gBoard[i][j].isFlag) {
            renderCell(i, j,FLAG)
            gBoard[i][j].isFlag = false
            removeFlag(i, j)
        }
        else {
            renderCell(i, j,FLAG)
            gBoard[i][j].isFlag = true
            gFlags.push({ i, j })
            checkGameOver()
       }
    }
    else {
    if (gBoard[i][j].isMarked) return
    if (gBoard[i][j].isSafe) {
        var elCelll = document.querySelector(`.cell-${i}-${j}`)
        elCelll.style.background = '#34495e'
        if (gBoard[i][j].minesAroundCount === '') {
            gBoard[i][j].isMarked = true
            gBoard[i][j].isShown = true
            gBoard[i][j].element = ''
            expandShown(i, j)
        }
        else {
            gBoard[i][j].element = gBoard[i][j].minesAroundCount
            renderCell(i,j,gBoard[i][j].element)
        }

    }
    if (!isOn) return
    gClicks++
    if (gClicks === 1) {
        setTimer()
        placeBombs(i,j)
        setMinesNegsCount(gBoard)
        gFirstClick = { i, j }
        gBoard[i][j].isMarked = true
        gBoard[i][j].isShown = true
        var elCelll = document.querySelector(`.cell-${i}-${j}`)
        elCelll.style.background = '#34495e'
        if (gBoard[i][j].minesAroundCount === '') {
            gBoard[i][j].isMarked = true
            gBoard[i][j].isShown = true
            gBoard[i][j].element = ''
            expandShown(i, j)
        }
        else {
            gBoard[i][j].element = gBoard[i][j].minesAroundCount
            renderCell(i,j,gBoard[i][j].element)
        }
    }
    else if (gClicks > 1) {
        if (gBoard[i][j].isMarked) return
        if (gBoard[i][j].minesAroundCount === '' && !gBoard[i][j].isMine) {
            gBoard[i][j].isMarked = true
            gBoard[i][j].isShown = true
            gBoard[i][j].element = ''
            expandShown(i, j)
            checkGameOver()
        } else {
            if (!gBoard[i][j].isMine) {
            gBoard[i][j].isMarked = true
            gBoard[i][j].isShown = true
            gBoard[i][j].element = gBoard[i][j].minesAroundCount
            renderCell(i,j,gBoard[i][j].element)
            var elCellh = document.querySelector(`.cell-${i}-${j}`)
            elCellh.style.background = '#34495e'
            checkGameOver()
            }
    }

        if (gBoard[i][j].isMine && gLevel.MINES === 2) {
            showBombs()
            endGame()
        }
        else if (gBoard[i][j].isMine && gLevel.MINES !== 2) {

            if (gMinesPressed === 2 || gHeart === 1) {
                showBombs()
                renderCell(i,j,BOMB)
                gHeart--
                printLives(gHeart)
                endGame()
            }
            else {
                if (!gBoard[i][j].isShown) {
                    renderCell(i,j,BOMB)
                    gBoard[i][j].isShown = true
                    gHeart--
                    gMinesPressed++
                    printLives(gHeart)
                }
            }
    }

}
    }
}


function removeFlag(i, j) {
    for (var k = 0; k < gFlags.length; k++) {
        if (gFlags[k].i === i && gFlags[k].j === j)
            gFlags.splice(k, 1)
    }
}
function restartGame() {
    printLives()
    initGame(gCurrLevel)
}

function safeButtonShow() {
    var isDone = false
    if (!isOn) return
    while(!isDone) {
        if (gSafeButtonClicks === 1) {
            var elSelectSafeButton2 = document.querySelector('.safe-button button')
            elSelectSafeButton2.style.background = '#c0392b'
        }
        if (gSafeButtonClicks !== 0) {
            var randomNum = getRandomInt(0,gBoard.length)
            var randomNum2 = getRandomInt(0,gBoard[0].length)
                if (!gBoard[randomNum][randomNum2].isSafe && !gBoard[randomNum][randomNum2].isMine && !gBoard[randomNum][randomNum2].isMarked) {
                    var elSelect = document.querySelector(`.cell-${randomNum}-${randomNum2}`)
                    var elSelectSafeButton = document.querySelector('.safe-button span')
                    gBoard[randomNum][randomNum2].isSafe = true
                    gSafeButtonClicks--
                    elSelectSafeButton.innerText = gSafeButtonClicks
                    elSelect.style.background = '#27ae60'
                    if (gBoard[i][j].isMarked) {
                        setTimeout(() => elSelect.style.background = '#34495e', 1000)
                    } else {
                        setTimeout(() => elSelect.style.background = 'beige', 1000)
                    }
                    isDone = true
                }
    }
    else {
        
        var elSelectSafeButton2 = document.querySelector('.safe-button button')
        elSelectSafeButton2.style.background = '#c0392b'
        isDone = true
    }
    }
}

function loseGame() {
    if (gMinesPressed === 3) {
        gLives--
        arrLives.pop()
        showBombs()
        printLives()
        endGame()
    }
    if (gLives !== 1) {
        gMinesPressed++
        gLives--
        arrLives.pop()
        printLives()
        checkGameOver()
    }
    else {
        gMinesPressed++
        gLives--
        arrLives.pop()
        showBombs()
        printLives()
        endGame()
    }
}

function restoreSmiley() {
    var selectSmiley = document.querySelector('.smiley span')
    selectSmiley.innerHTML = SMILEY
}

function markSafePlace(elSelect) {
    elSelect.style.background = 'red'
}

function placeBombs(i,j) {
    var ranNum
    var ranNum2
    while(gBombs.length != gLevel.MINES) {
        ranNum = getRandomInt(0 ,gBoard.length - 1)
        ranNum2 = getRandomInt(0 ,gBoard.length - 1)
        if (ranNum !== i && ranNum2 !== j && !gBoard[ranNum][ranNum2].isShown && !gBoard[ranNum][ranNum2].isMine) {
            gBoard[ranNum][ranNum2].isMine = true
            gBoard[ranNum][ranNum2].element = BOMB
            gBoard[ranNum][ranNum2].isShown = false
            gBoard[ranNum][ranNum2].isMarked = false
            gBombs.push(gBoard[ranNum][ranNum2])
        }
    }  
}

function checkGameOver() {
    var countMarks = checkIfMark()
    if (countMarks === (gLevel.SIZE ** 2) - gLevel.MINES) {
        isOn = false
        clearInterval(gTimePassed)
        var selectSmiley = document.querySelector('.smiley span')
        selectSmiley.innerHTML = SMILEY
        message.innerText = `You win! try it in different level`
        
    }
}

function checkIfMark() {
    var counter = 0 
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMarked && !gBoard[i][j].isMine) {
                counter++
            }
        }
    }
    return counter
}
function endGame() {
    isOn = false
    clearInterval(gTimePassed)
    var selectSmiley = document.querySelector('.smiley span')
    selectSmiley.innerHTML = SMILEY2
    message.innerText = 'You lose the game! \n Please click the sad smiley to start again'

}

function setTimer() {
    gStartTimer = Date.now()
    gTimePassed = setInterval(startTimer, 1)
}

function startTimer() {
    var curretTime = Date.now() - gStartTimer
    var milSec = curretTime % 1000
    var sec = parseInt(curretTime / 1000)
    gTimerText.innerText = `${sec}:${milSec}`
}

function showBombs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
                gBoard[i][j].element = BOMB
                renderCell(i,j,BOMB)
            }
        }
    }
}

function showBomb(i,j) {
    renderCell(i,j,BOMB)
}

function printLives(num) {
    var strHTML=''

    if (num === 3) {
        strHTML = `${HEART} ${HEART} ${HEART}`
    }
    else if (num === 2) {

        strHTML = `${HEART} ${HEART} `
    }
    else if (num === 1) {
        strHTML = `${HEART}`
    }
    else {
        strHTML = ''
    }
    if (gCurrLevel !== 0) {
        var selector = document.querySelector('.lives span')
        selector.innerHTML = strHTML    
    }

}

function restoreLives() {
    var selector = document.querySelector('.lives span')
    selector.innerHTML = ''
}

function cellMarked(elCell,i,j) {
    elCell.isMarked = true
    elCell.isShown = true
    renderCell({i,j},elCell.minesAroundCount)
}

//when user click on empty cell//
function expandShown(i,j) {
    markCell(gBoard[i][j],i,j)
            for(var k = i-1; k<=i+1;k++){
                if(k<0 || k>= gBoard.length) continue
                for(var n= j-1;n<= j+1;n++){
                    if(n<0 || n>= gBoard[0].length) continue
                    if (n === i && k === j) return
                    if (gBoard[k][n].isMarked) continue
                    if (!gBoard[k][n].isMine) {
                        markCell(gBoard[k][n],k,n)
                    }
                }
            }
}
    
function markCell(currCell,i,j) {
    var elCellh = document.querySelector(`.cell-${i}-${j}`)
    if (!currCell.isMine) {
        if (currCell.minesAroundCount === 0) {
            currCell.element = ''
            elCellh.style.background = '#34495e'
            currCell.isMarked = true
            currCell.isShown = true
            renderCell(i,j,currCell.element)
        }
        else {
            currCell.element = currCell.minesAroundCount
            currCell.isMarked = true
            currCell.isShown = true
            elCellh.innerText = currCell.element
            renderCell(i,j,currCell.element)
            elCellh.style.background = '#34495e'

        }
    }

}

function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

function renderCell(i, j, value = '') {
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = value
}

function removeFlag(i, j) {
    for (var k = 0; k < gFlags.length; k++) {
        if (gFlags[k].i === i && gFlags[k].j === j)
            gFlags.splice(k, 1)
    }
}

