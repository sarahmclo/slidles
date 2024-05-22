// Wait for DOM to finish loading before running puzzle
// Get button elements and add event listeners

document.addEventListener("DOMContentLoaded", function () {
  let buttons = document.getElementsByTagName("button-container");

  for (let button of buttons) {
      button.addEventListener("click", function () {
          if (this.getAttribute("data-type") === "submit") {
              checkAnswer();
          } else {
              let gameType = this.getAttribute("data-type");
              runGame(gameType);
          }
      });
  }

  document.getElementById("answer-box").addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
          checkAnswer();
      }
  });

  runGame("addition");

});

 // Variables
 
 
 // Functions


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

/** Modal */
// Modal - adapted from tutorial: https://www.w3schools.com/howto/howto_css_modals.asp adjusted to use click on image (not button) to open modal
// Get the modal
var modal = document.getElementById("myModal");

// Get the image that opens the modal
var img = document.getElementById("info-modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the image, open the modal
img.onclick = function() {
modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
  modal.style.display = "none";
}
}
