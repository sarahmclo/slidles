// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function () {

    // Switch Button
    const switchButton = document.querySelector('.switchButton');
    const puzzleSelectModal = document.getElementById('puzzleSelectModal');

    switchButton.addEventListener('click', function () {
        puzzleSelectModal.style.display = "block";
    });

    // Puzzle Selection Modal
    const puzzleOptions = document.querySelectorAll('.puzzle-option');
    const hintImage = document.getElementById('hintImage');

    puzzleOptions.forEach(option => {
        option.addEventListener('click', function () {
            const newPuzzleSrc = option.getAttribute('src');
            updatePuzzle(newPuzzleSrc);
            puzzleSelectModal.style.display = "none";
        });
    });

    function updatePuzzle(newSrc) {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((tile, index) => {
            tile.style.backgroundImage = `url(${newSrc})`;
        });
        // Replace 'black-hint.webp' with 'black-slidle.webp' in the hint image source
        hintImage.src = newSrc.replace('-hint', '-slidle');
    }

    // Close Modal
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            button.parentElement.parentElement.style.display = "none";
        });
    });

    // Close modal on outside click
    window.addEventListener("click", function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    });

    const playButton = document.querySelector('.playButton');
    const tiles = document.querySelectorAll('.tile');
    const timerDisplay = document.getElementById('timer');
    const movesDisplay = document.getElementById('moves');
    const audio = document.getElementById('slide-click-sound');
    const solution = ["1", "2", "3", "4", "5", "6", "7", "8", ""];

    let moves = 0;
    let timerInterval;
    let seconds = 0;
    let minutes = 0;
    let gameStarted = false;
    let blankTileRow = 2;
    let blankTileCol = 2;

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

    function isSolved() {
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].textContent !== solution[i]) {
                return false;
            }
        }
        return true;
    }

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
        document.getElementById("winModal").style.display = "none";
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    });

    // Audio Modal
    document.getElementById('volume-icon').addEventListener('click', toggleAudioModal);

    function toggleAudioModal() {
        const audioModal = document.getElementById("audioModal");
        audioModal.style.display = audioModal.style.display === "block" ? "none" : "block";
    }

    // Resume Button in Audio Modal
    const resumeButton = document.getElementById("resumeButton");
    resumeButton.addEventListener("click", resumeSettings);

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

        document.getElementById("audioModal").style.display = "none";
    }

    // Info Modal
    const infoModal = document.getElementById("myModal");
    const infoButton = document.getElementById("info-modal");
    const infoCloseButton = document.getElementsByClassName("close")[0];

    infoButton.onclick = function () {
        infoModal.style.display = "block";
    };

    infoCloseButton.onclick = function () {
        infoModal.style.display = "none";
    };

    // Hint Button
    const hintButton = document.querySelector(".hintButton");
    const hintModal = document.getElementById("hintModal");

    hintButton.addEventListener("click", function () {
        hintModal.style.display = "block";
    });

    hintModal.addEventListener("click", function (event) {
        if (event.target === hintModal || event.target.tagName === 'IMG') {
            hintModal.style.display = "none";
        }
    });

    // Close modals on overlay click (continued)
    window.addEventListener("click", function (event) {
        if (event.target === infoModal) {
            infoModal.style.display = "none";
        }
        if (event.target === hintModal) {
            hintModal.style.display = "none";
        }
        const winModal = document.getElementById("winModal");
        const winCloseButton = winModal.getElementsByClassName("close")[0];
        winCloseButton.onclick = function () {
            winModal.style.display = "none";
        };
    });

    // Puzzle solved confetti animation
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
});    