// select the hamberger
var hamburger = document.querySelector('#hamburger');
// on click shift css stuff
hamburger.addEventListener('click', function(e) {
  console.log("clicked!")
  var sidebar = document.querySelector('#sidebar');
  function opennav() {
    hamburger.style.left = "30%";
    sidebar.style.width = "30%";
    document.querySelector('#main').style.width = "70%";
    document.querySelector('#main').style.marginLeft = "30%";
    document.querySelector('#controls').style.left = "0";
    document.querySelector('#controls').style.width = "100%";
  }
  function closenav() {
    hamburger.style.left = "0";
    sidebar.style.width = "0";
    document.querySelector('#main').style.width = "100%";
    document.querySelector('#main').style.marginLeft = "0";
    document.querySelector('#controls').style.left = "15%";
    document.querySelector('#controls').style.width = "75%";
  }

  if (sidebar.getAttribute('data-status') == "close") {
    console.log("opennav");
    opennav();
    sidebar.dataset.status = "open";
  }
  else {
    console.log("closenav");
    closenav();
    sidebar.dataset.status = "close";
  }

});
