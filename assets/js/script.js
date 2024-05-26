// Wait for DOM to finish loading before running puzzle

document.addEventListener("DOMContentLoaded", startGame);

//Get elements
const tiles = document.querySelectorAll('.tile');
const timerDisplay = document.getElementById('timer')
const movesDisplay = document.getElementById('moves');
const playButton = document.querySelector('.playButton');

//Puzzle Variables
let blankTileRow = 2; // Row index of the blank tile (0-based)
let blankTileCol = 2; // Column index of the blank tile (0-based)

// Function to shuffle tiles
function shuffle() {
  // Shuffle the tiles for 100 moves
  for (let i = 0; i < 100; i++) {
      const directions = ['up', 'down', 'left', 'right'];
      const randomIndex = Math.floor(Math.random() * 4);
      const direction = directions[randomIndex];
      moveTile(direction);
  }
}

// Function to move a tile
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

    // Check if the puzzle is solved after each move
    if (isSolved()) {
      // Display the "You solved Slidles!" message
      alert("You solved Slidles!");

      // Stop the timer
      clearInterval(timerInterval);

      // Reset the game
      resetGame();
    }
  }
}

// Function to swap tiles
function swapTiles(row1, col1, row2, col2) {
  const tile1Index = row1 * 3 + col1;
  const tile2Index = row2 * 3 + col2;
  [tiles[tile1Index].textContent, tiles[tile2Index].textContent] = [tiles[tile2Index].textContent, tiles[tile1Index].textContent];
  [tiles[tile1Index].className, tiles[tile2Index].className] = [tiles[tile2Index].className, tiles[tile1Index].className];
}

function clickTile(row, column) {
  var cell = document.getElementById("cell" + row + column);
  var tile = cell.className;
  if (tile != "tile9") {
    // Checking if white tile on the right
    if (column < 3 && document.getElementById("cell" + row + (column + 1)).className == "tile9") {
      swapTiles("cell" + row + column, "cell" + row + (column + 1));
      return;
    }
    // Checking if white tile on the left
    if (column > 1 && document.getElementById("cell" + row + (column - 1)).className == "tile9") {
      swapTiles("cell" + row + column, "cell" + row + (column - 1));
      checkPuzzleSolved();
      return;
    }
    // Checking if white tile is above
    if (row > 1 && document.getElementById("cell" + (row - 1) + column).className == "tile9") {
      swapTiles("cell" + row + column, "cell" + (row - 1) + column);
      checkPuzzleSolved();
      return;
    }
    // Checking if white tile is below
    if (row < 3 && document.getElementById("cell" + (row + 1) + column).className == "tile9") {
      swapTiles("cell" + row + column, "cell" + (row + 1) + column);
      checkPuzzleSolved();
      return;
    }
  }
}
function checkPuzzleSolved() {

  var expectedClass = "tile1";

  for (var i = 1; i <= 8; i++) {

    var cell = document.getElementById("cell" + Math.ceil(i / 3) + ((i - 1) % 3 + 1));

    if (cell.className != expectedClass) {

      return; // Puzzle not solved
    }
    expectedClass = "tile" + (i + 1);
  }
}

// Add event listeners to the tiles
tiles.forEach((tile, index) => {
  tile.addEventListener('click', () => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      if (Math.abs(row - blankTileRow) + Math.abs(col - blankTileCol) === 1 && gameStarted) {
          moveTile(getDirection(row, col));
      }
  });
});

// Add event listener to the play button
playButton.addEventListener('click', () => {
  shuffle();
  gameStarted = true;

  // Start the timer when the game starts
  timerInterval = setInterval(() => {
      seconds++;
      if (seconds === 60) {
          minutes++;
          seconds = 0;
      }
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
});

// Function to get the direction of the move
function getDirection(row, col) {
  if (row < blankTileRow) {
      return 'up';
  } else if (row > blankTileRow) {
      return 'down';
  } else if (col < blankTileCol) {
      return 'left';
  } else {
      return 'right';
  }
}

// Reset the game when the page loads
resetGame();
});

// Add event listener to the "Play" button
document.querySelector(".playButton").addEventListener("click", shuffle);

//Switch image
let images = [
  "url('assets/images/pink-slidle.webp')",
  "url('assets/images/black-slidle.webp')",
  "url('assets/images/yellow-slidle.webp')",
  "url('assets/images/white-slidle.webp')"
];

let currentImageIndex = 0;

function switchImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length; // Cycle through images

  let tiles = document.querySelectorAll(".tile1, .tile2, .tile3, .tile4, .tile5, .tile6, .tile7, .tile8, .tile9");

  tiles.forEach((tile, index) => {
    if (tile.classList.contains("tile9")) {
      // Ensure the blank tile has a white background
      tile.style.backgroundImage = "none";
      tile.style.backgroundColor = "white";
    } else {
      tile.style.backgroundImage = images[currentImageIndex];
    }
  });
}

/** Audio */
// Toggle On/Off - adapted from tutorial: https://stackoverflow.com/questions/55018585/how-to-turn-on-audio-on-click-icon-play-pause
function togglePlay() {
  let audio = document.getElementsByTagName("audio")[0];
  if (audio) {
    if (audio.paused) {
      audio.play();
      document.getElementById("volume-icon").src = "assets/images/vol-on.webp";
    } else {
      audio.pause();
      document.getElementById("volume-icon").src = "assets/images/vol-off.webp";
    }
  }
}

/** Modal for info icon */
// Modal - adapted from tutorial: https://www.w3schools.com/howto/howto_css_modals.asp adjusted to use click on image (not button) to open modal
// Get the modal
var modal = document.getElementById("myModal");

// Get the image that opens the modal
var img = document.getElementById("info-modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the image, open the modal
img.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
;

//* Modal for hint image */
//Get the hint button element
const hintButton = document.querySelector('.hintButton');

//Get the hint modal element
const hintModal = document.getElementById('hintModal');

//Add click event listener to hint button
hintButton.addEventListener("click", function () {
  // Display the hint modal
  hintModal.style.display = "block";
});

// Close the hint modal when clicked anywhere on the modal or image
hintModal.addEventListener("click", function (event) {
  if (event.target === hintModal || event.target.tagName === 'IMG') {
    // Close the hint modal
    hintModal.style.display = "none";
  }
});

// Close the hint modal when the user clicks in or outside the modal
window.addEventListener("click", function (event) {
  if (event.target === hintModal) {
    hintModal.style.display = "none";
  }
});