function createMatx(rows, cols) {
    var matx = []
    for (var i = 0; i < rows; i++) {
        var row = []
        for (var j = 0; j < cols; j++) {
            row.push('')
        }
        matx.push(row)
    }
    return matx
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function playAudio(sound) {
    var audio = new Audio(sound)
    audio.play()
}

function showModal() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
}

function closeModal() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}