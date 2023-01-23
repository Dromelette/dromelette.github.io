document.getElementById("button").addEventListener("click", function() {
  
  document.body.style.background = "url('cat.gif') center"
  
  // Hide the heading and the button
  document.querySelector(".everything").style.display = "none"


  // Play song
  var song = document.getElementById("song")
  song.play()
})