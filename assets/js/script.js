document.addEventListener("DOMContentLoaded", function () {
    const switchButton = document.querySelector('.switchButton');
    const puzzleSelectModal = document.getElementById('puzzleSelectModal');
    const puzzleOptions = document.querySelectorAll('.puzzle-option');
    const hintImage = document.getElementById('hintImage');
    const closeButtons = document.querySelectorAll('.modal .close');
    const playButton = document.querySelector('.playButton');
    const tiles = document.querySelectorAll('.tile');
    const timerDisplay = document.getElementById('timer');
    const movesDisplay = document.getElementById('moves');
    const solution = ["1", "2", "3", "4", "5", "6", "7", "8", ""];
    const hintButton = document.querySelector(".hintButton");
    const hintModal = document.getElementById("hintModal");
    const infoModal = document.getElementById("myModal");
    const infoButton = document.getElementById("info-modal");
    const infoCloseButton = document.getElementsByClassName("close")[0];
    const winModal = document.getElementById("winModal");
    const winCloseButton = winModal.getElementsByClassName("close")[0];
    const audioModal = document.getElementById("audioModal");
    const resumeButton = document.getElementById("resumeButton");

    let moves = 0;
    let timerInterval;
    let seconds = 0;
    let minutes = 0;
    let gameStarted = false;
    let blankTileRow = 2;
    let blankTileCol = 2;

    function updatePuzzle(newSrc) {
        tiles.forEach((tile, index) => {
            const number = index + 1;
            if (number <= 8) {
                tile.style.backgroundImage = `url(${newSrc})`;
                tile.textContent = number.toString();
                tile.className = `tile tile${number}`;
            } else {
                tile.style.backgroundImage = 'none'; // Ensure blank tile has no background
                tile.textContent = ""; // Ensure the 9th tile is empty
                tile.className = 'tile tile9';
            }
        });
        blankTileRow = 2;
        blankTileCol = 2;
        hintImage.src = newSrc.replace('-hint', '-slide'); // Update hint image source if needed
        resetTimerAndMoves(); // Reset timer and moves
    }
       

    function shuffle() {
        for (let i = 0; i < 100; i++) {
            const directions = ['up', 'down', 'left', 'right'];
            const randomIndex = Math.floor(Math.random() * 4);
            moveTile(directions[randomIndex]);
        }
        moves = 0;
        movesDisplay.textContent = moves;
    }

    function moveTile(direction) {
        let validMove = false;
        switch (direction) {
            case 'up':
                if (blankTileRow > 0) {
                    swapTiles(blankTileRow, blankTileCol, blankTileRow - 1, blankTileCol);
                    blankTileRow--;
                    validMove = true;
                }
                break;
            case 'down':
                if (blankTileRow < 2) {
                    swapTiles(blankTileRow, blankTileCol, blankTileRow + 1, blankTileCol);
                    blankTileRow++;
                    validMove = true;
                }
                break;
            case 'left':
                if (blankTileCol > 0) {
                    swapTiles(blankTileRow, blankTileCol, blankTileRow, blankTileCol - 1);
                    blankTileCol--;
                    validMove = true;
                }
                break;
            case 'right':
                if (blankTileCol < 2) {
                    swapTiles(blankTileRow, blankTileCol, blankTileRow, blankTileCol + 1);
                    blankTileCol++;
                    validMove = true;
                }
                break;
        }
        if (validMove && gameStarted) {
            moves++;
            movesDisplay.textContent = moves;
            const clickSound = document.getElementById("slide-click-sound");
            clickSound.currentTime = 0;
            clickSound.play();
            if (isSolved()) {
                clearInterval(timerInterval);
                document.getElementById("winModal").style.display = "block";
                document.getElementById("winModalTime").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                document.getElementById("winModalMoves").textContent = `${moves}`;
                puzzleSolved();
            }
        }
    }

    function swapTiles(row1, col1, row2, col2) {
        const tile1Index = row1 * 3 + col1;
        const tile2Index = row2 * 3 + col2;
        [tiles[tile1Index].textContent, tiles[tile2Index].textContent] = [tiles[tile2Index].textContent, tiles[tile1Index].textContent];
        [tiles[tile1Index].className, tiles[tile2Index].className] = [tiles[tile2Index].className, tiles[tile1Index].className];
    }

    function getDirection(row, col) {
        if (row < blankTileRow) return 'up';
        if (row > blankTileRow) return 'down';
        if (col < blankTileCol) return 'left';
        return 'right';
    }

    function resetGame() {
        tiles.forEach((tile, index) => {
            tile.textContent = index < 8 ? (index + 1).toString() : "";
            tile.className = `tile tile${index + 1}`;
        });
        blankTileCol = 2;
        blankTileRow = 2;
        moves = 0;
        movesDisplay.textContent = moves;
        gameStarted = false;
        clearInterval(timerInterval);
        seconds = 0;
        minutes = 0;
        timerDisplay.textContent = '00:00';
    }

    function resetTimerAndMoves() {
        clearInterval(timerInterval);
        seconds = 0;
        minutes = 0;
        timerDisplay.textContent = '00:00';
        moves = 0;
        movesDisplay.textContent = moves;
    }

    function isSolved() {
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].textContent !== solution[i]) {
                return false;
            }
        }
        return true;
    }

    function puzzleSolved() {
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti({
            confettiColors: [
                '#F3A0BC', '#A8CD6E', '#F2DD4E', '#87AAD0', '#FCBE4F', '#FF69B4', '#FFFFFF',
            ],
        });
        const winSound = document.getElementById("win-sound");
        winSound.currentTime = 0;
        winSound.play();
    }

    function togglePlay() {
        audioModal.style.display = "block";
    }

    function resumeSettings() {
        const music = document.getElementById("music");
        const slideClickSound = document.getElementById("slide-click-sound");
        const winSound = document.getElementById("win-sound");

        const musicToggle = document.getElementById("music-toggle").checked;
        const sfxToggle = document.getElementById("sfx-toggle").checked;

        if (musicToggle) {
            music.play();
            document.getElementById("volume-icon").src = "assets/images/vol-on.webp";
        } else {
            music.pause();
            music.currentTime = 0;
            document.getElementById("volume-icon").src = "assets/images/vol-off.webp";
        }

        slideClickSound.muted = !sfxToggle;
        winSound.muted = !sfxToggle;

        audioModal.style.display = "none";
    }

    switchButton.addEventListener('click', function () {
        puzzleSelectModal.style.display = "block";
    });

    puzzleOptions.forEach(option => {
        option.addEventListener('click', function () {
            const newPuzzleSrc = option.getAttribute('src');
            updatePuzzle(newPuzzleSrc);
            resetTimerAndMoves();
            puzzleSelectModal.style.display = "none";
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            button.closest('.modal').style.display = "none";
        });
    });

    window.addEventListener("click", function (event) {
        if (event.target === hintModal) {
            hintModal.style.display = "none";
        }
    });

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            if (Math.abs(row - blankTileRow) + Math.abs(col - blankTileCol) === 1 && gameStarted) {
                moveTile(getDirection(row, col));
            }
        });
    });

    playButton.addEventListener('click', function () {
        resetGame();
        shuffle();
        gameStarted = true;
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    });

    document.querySelector("#winModal .playAgainButton").addEventListener("click", function () {
        resetGame();
        shuffle();
        gameStarted = true;
        winModal.style.display = "none";
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    });

    document.addEventListener('DOMContentLoaded', function() {
        const playButton = document.getElementById('play-button');
        const SlideClicksound = new Howl({ 
            src: ['assets/audio/slide-click.mp3', 'assets/audio/615099__mlaudio__magic_game_win_success.wav'], 
            preload: true
        });

        playButton.addEventListener('click', function() {
            SlideClicksound.play();
        });
    });

    window.onload = function () {
        document.getElementById("volume-icon").onclick = togglePlay;
        resumeButton.onclick = resumeSettings;

        const slideClickSound = document.getElementById("slide-click-sound");
        slideClickSound.muted = true;
        slideClickSound.currentTime = 0;

        const winSound = document.getElementById("win-sound");
        winSound.muted = true;
        winSound.currentTime = 0;
    };

    infoButton.onclick = function () {
        infoModal.style.display = "block";
    };

    infoCloseButton.onclick = function () {
        infoModal.style.display = "none";
    };

    hintButton.addEventListener("click", function () {
        hintModal.style.display = "block";
    });

    hintModal.addEventListener("click", function (event) {
        if (event.target === hintModal || event.target.tagName === 'IMG') {
            hintModal.style.display = "none";
        }
    });

    winCloseButton.onclick = function () {
        winModal.style.display = "none";
    };
});