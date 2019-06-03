// Get the modal
var modal = document.getElementById("myModal");
var modalContent = document.getElementById("modal-content");
var modalText = document.getElementById("modal-text");
var modalWelcome = document.getElementById("modal-welcome");

// Get the button that opens the modal
var next = document.getElementById("mynext");

var next = document.getElementById("next");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var hide = document.getElementById("hide");

var bodyDiv = document.getElementById("bodyDiv");
var rimDiv = document.getElementById("rimDiv");
var leatherDiv = document.getElementById("leatherDiv");
var detailsDiv = document.getElementById("detailsDiv");

var prevColor = "";

var language;

function getLanguage() {
  (localStorage.getItem('language') == null) ? setLanguage('en'): false;
  $.ajax({
    url: '/language/' + localStorage.getItem('language') + '.json',
    dataType: 'json',
    async: false,
    dataType: 'json',
    success: function (lang) {
      language = lang
    }
  });
}


// When the user clicks on the button, open the modal
function openModal() {
  getLanguage()
  modalWelcome.innerHTML = language.modalWelcome;
  modalText.innerHTML = language.modalText;
  modal.style.display = "block";
  hide.style.display = "block";
  prevColor = bodyDiv.style.background;
  next.onclick = nextBody;
  bodyDiv.style.zIndex = 2;
  //bodyDiv.style.background = "white";

}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  end();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    end();
  }
}

function end() {
  modal.style.display = "none";
  hide.style.display = "none";
  bodyDiv.style.background = prevColor;
  rimDiv.style.background = prevColor;
  leatherDiv.style.background = prevColor;
  detailsDiv.style.background = prevColor;
  bodyDiv.style.zIndex = 0;
  rimDiv.style.zIndex = 0;
  leatherDiv.style.zIndex = 0;
  detailsDiv.style.zIndex = 0;
  next.onclick = nextBody;
}

function nextDetails() {
  leatherDiv.style.background = prevColor;
  leatherDiv.style.zIndex = 0;
  detailsDiv.style.zIndex = 2;
  detailsDiv.style.background = "white";
  modalText.innerHTML = language.modalDetails;
  next.onclick = end; 
}

function nextLeather() {
  rimDiv.style.background = prevColor;
  rimDiv.style.zIndex = 0;
  leatherDiv.style.zIndex = 2;
  leatherDiv.style.background = "white";
  modalText.innerHTML = language.modalLeather;
  next.onclick = nextDetails;
}

function nextRim() {
  bodyDiv.style.background = prevColor;
  bodyDiv.style.zIndex = 0;
  rimDiv.style.zIndex = 2;
  rimDiv.style.background = "white";
  modalText.innerHTML = language.modalRim;
  next.onclick = nextLeather;
}

function nextBody() {
  bodyDiv.style.background = "white";
  bodyDiv.zIndex = 2;
  modalText.innerHTML = language.modalBody;
  next.onclick = nextRim;
}