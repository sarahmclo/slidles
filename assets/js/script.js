// Wait for DOM to finish loading before running puzzle

//document.addEventListener("DOMContentLoaded", startGame);

function startGame() {
  console.log("startGame function called");
  shuffle();
}

function enableTileClicks() {
  console.log("enableTileClicks function called");
  var tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile, index) => {
      tile.setAttribute("onclick", `clickTile(${Math.floor(index / 3) + 1}, ${(index % 3) + 1});`);
  });
}

// Puzzle
function swapTiles(cell1, cell2) {
  var temp = document.getElementById(cell1).className;
  document.getElementById(cell1).className = document.getElementById(cell2).className;
  document.getElementById(cell2).className = temp;
}

function shuffle() {
  // Use nested loops to access each cell of the 3x3 grid
  for (var row = 1; row <= 3; row++) { // For each row of the 3x3 grid
      for (var column = 1; column <= 3; column++) { // For each column in this row
          var row2 = Math.floor(Math.random() * 3 + 1); // Pick a random row from 1 to 3
          var column2 = Math.floor(Math.random() * 3 + 1); // Pick a random column from 1 to 3
          swapTiles("cell" + row + column, "cell" + row2 + column2); // Swap the look & feel of both cells
      }
  }
  enableTileClicks(); //Enable tile clicks after shuffling
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
          return;
      }
      // Checking if white tile is above
      if (row > 1 && document.getElementById("cell" + (row - 1) + column).className == "tile9") {
          swapTiles("cell" + row + column, "cell" + (row - 1) + column);
          return;
      }
      // Checking if white tile is below
      if (row < 3 && document.getElementById("cell" + (row + 1) + column).className == "tile9") {
          swapTiles("cell" + row + column, "cell" + (row + 1) + column);
          return;
      }
  }
}
// Add event listener to the "Play" button
document.querySelector(".playButton").addEventListener("click", startGame);

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