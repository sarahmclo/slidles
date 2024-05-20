/** Audio */
// Toggle On Off https://stackoverflow.com/questions/55018585/how-to-turn-on-audio-on-click-icon-play-pause
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