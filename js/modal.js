// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

var next = document.getElementById("next");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var hide = document.getElementById("hide");

var bodyDiv = document.getElementById("bodyDiv");

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  hide.style.display = "block";
  bodyDiv.style.background = "white";
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

function goNext() {
  console.log("asd");
}