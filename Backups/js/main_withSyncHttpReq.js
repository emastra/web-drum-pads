// Global variables

var pads = Object.create(null);
// it contains 1- the sound obj, which contains the added effect eventually. 2- The effect string name.
pads = {A: {}, S: {}, D: {}, F: {}, G: {}, H: {}, J: {}, K: {}, L: {} };
// it contains all the created effect objects
var effects = Object.create(null);
// all key divs array
var keys = Array.from(document.querySelectorAll('.key'));
// variable to temporary store the sound to be previewed. Used in previewSound function which is called when preview play button is clicked.
var prevSound = null;


loadPresetSounds('/playlists/presets');
createSoundList('/sounds');
//createPlaylistList('/playlists');
loadEffects();

// On DOM ready
domReady(function() {

  // add playSound when key is pressed
  window.addEventListener('keydown', playSound);
  // add removeTransition to each key div
  keys.forEach(key => key.addEventListener('transitionend', removeTransition));
  // add event listener to each soundlist's preview button
  var previewButtons = document.querySelectorAll(".preview-btn");
  previewButtons.forEach(function(btn) {
    btn.addEventListener("click", previewSound);
  });
  // Apply collapsibleList stuff
  //CollapsibleLists.applyTo(document.getElementById('soundList'));
  CollapsibleLists.applyTo(document.getElementById('listHeads'));
  // add event listener to each setlist's loadit-btn
  var loaditButtons = document.querySelectorAll(".loadit-btn");
  loaditButtons.forEach(function(btn) {
    btn.addEventListener("click", loadPlaylist);
  });
  // add toggleFX to each fxSelect
  var fxSelects = Array.from(document.querySelectorAll('.fxSelect'));
  fxSelects.forEach(fxSelect => fxSelect.addEventListener('change', toggleFX));
  // add adjustFX to each effect range input // this is done during template instantiation
  //var FxRanges = document.querySelectorAll('.ranges');
  //FxRanges.forEach(function(range) { range.addEventListener('input', adjustFX) });

  // dragula stuff
  doDragula();

// end of domReady function
});
