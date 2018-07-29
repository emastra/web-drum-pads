// Global variables

var pads = Object.create(null);
// it contains 1- the sound obj, which contains the added effect eventually. 2- The effect string name.
pads = {A: {}, S: {}, D: {}, F: {}, G: {}, H: {}, J: {}, K: {}, L: {} };
// it contains all the created effect objects
var effects = Object.create(null);

// all key divs array
var keys = Array.from(document.querySelectorAll('.key'));

var presets = { "A": "sounds/clap.wav",
                "S": "sounds/hihat.wav",
                "D": "sounds/kick.wav",
                "F": "sounds/openhat.wav",
                "G": "sounds/boom.wav",
                "H": "sounds/ride.wav",
                "J": "sounds/snare.wav",
                "K": "sounds/tom.wav",
                "L": "sounds/tink.wav" };

// Functions

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('playing');
}

function loadSounds() {
  keys.forEach(function(key) {
    // the key div kbd
    var kbd = key.dataset.kbd;
    // extract the sound path from presets data
    var path = presets[kbd];
    // assign new sound to pads obj
    //pads[kbd].sound = new Pizzicato.Sound(path);
    //pads[kbd].sound.attack = 0;
    pads[kbd].sound = new Pizzicato.Sound({
      source: 'file',
      options: { path: path, attack: 0 }
    });
  });
  console.log("done with loading all pads");
}

function loadEffects() {
  console.log("starting loadEffects");
  effects['delay'] = new Pizzicato.Effects.Delay();
  effects['reverb'] = new Pizzicato.Effects.Reverb({ time: 0.6, decay: 0.5 });
  effects['distortion'] = new Pizzicato.Effects.Distortion();
  effects['flanger'] = new Pizzicato.Effects.Flanger();
}

function playSound(e) {
  // the pressed key div
  var key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  // the pressed kbd
  var kbd = key.dataset.kbd;
  // add class for animation
  key.classList.add('playing');
  // play the sound (from start)
  /*
  var delay = new Pizzicato.Effects.Delay({
    feedback: 0.1,
    time: 0.1,
    mix: 0.2
});
  pads[kbd].addEffect(delay); */
  pads[kbd].sound.stop();
  pads[kbd].sound.play();
}

function toggleFX(e) {
  // LOAD THE RIGHT EFFECT INTO THE CHANNEL
  // get the selected effect from select input
  var effectOn = e.target.value; // string: delay, reverb, ecc
  // get kbd channel where the effect is to be loaded
  var kbd = e.target.parentElement.dataset.kbd;

  if (effectOn == 'noeffects') {
    pads[kbd].sound.removeEffect(effects[pads[kbd].effect]);
    document.querySelector('.rangesContainer').querySelector(`[data-kbd="${kbd}"]`).style.visibility = 'hidden';
    pads[kbd].effect = undefined;
  }
  else {
    if (pads[kbd].effect) pads[kbd].sound.removeEffect(effects[pads[kbd].effect]);
    // add the obj of the selected effect into pads.sound
    pads[kbd].sound.addEffect(effects[effectOn]);
    // add the name of the loaded effect. it's just a string!
    pads[kbd].effect = effectOn;

    /* prepare the childs of channelRange (which is inside the rangeContainer)
    one template-effectParameter div for each effect parameter (to be found inside options +defaults)
    console.log(effects[effectOn].options); */
    // select the template
    var templateFxParam = document.querySelector('#template-effectParameter');
    //console.log(templateFxParam);
    // initialize array to save each created parameter div (inputRange)
    var nodesArray = [];
    // iterate over the effect parameter
    var effectOptions = effects[effectOn].options;
    for (var param in effectOptions) {
      if (effectOptions.hasOwnProperty(param)) {
          //console.log(param);
          //console.log(effectOptions[param]);
          // write the fx title
          //console.log(copy)
          var copy = templateFxParam.children[0].cloneNode(true);
          copy.querySelector('.fxTitle').textContent = param[0].toUpperCase() + param.substr(1);
          // set data-parameter
          copy.querySelector('input').setAttribute('data-parameter', param);
          // set fxValue with effect paramet defaults
          copy.querySelector('.fxValue').textContent = effectOptions[param];
          // add the event listener
          var inputElt = copy.querySelector('input');
          inputElt.addEventListener('input', adjustFX);
          // push the filled template into the array
          nodesArray.push(copy);
      }
    }
    // display range container
    var rangesContainer = document.querySelector('.rangesContainer');
    rangesContainer.style.visibility = 'visible';
    // select the right channelRange
    var channelRange = rangesContainer.querySelector(`[data-kbd="${kbd}"]`);
    // append the filled template into channelRange
    //console.log(...nodesArray)
    nodesArray.forEach(function(node) {
      //console.log(node);
      channelRange.appendChild(node);
    });
    // display the filled channel range
    channelRange.style.visibility = 'visible';
  }
}

function adjustFX(e) {
  // get the range node
  var range = e.target;
  //console.log(range.value);
  // get the kbd channel
  var kbd = e.target.parentElement.parentElement.dataset.kbd; // A, S, ecc
  // get the name of the loaded effect into the channel
  var effectOn = pads[kbd].effect; // string: delay or distortion, ecc.
  // get the effect parameter being used (feedback, gain, ecc)
  var parameterOn = range.dataset.parameter;
  // set the effect parameter to the actual range value (for every range input)
  pads[kbd].sound.effects[0][parameterOn] = range.value / 100; // il min e max del range input è 0 - 100!!
  // put the range value into the fxValue span
  var fxValue = range.previousElementSibling.getElementsByClassName('fxValue')[0];
  console.log(fxValue);
  fxValue.textContent = range.value / 100;

  console.log(kbd, effectOn, parameterOn, ': ', pads[kbd].sound.effects[0][parameterOn])
}

// ACTIONS

// add removeTransition to each key div
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
// add playSound when key is pressed
window.addEventListener('keydown', playSound);
// add toggleFX to each fxSelect
var fxSelects = Array.from(document.querySelectorAll('.fxSelect'));
fxSelects.forEach(fxSelect => fxSelect.addEventListener('change', toggleFX));
// add adjustFX to each effect range input // this is done during template instantiation
//var FxRanges = document.querySelectorAll('.ranges');
//FxRanges.forEach(function(range) { range.addEventListener('input', adjustFX) });


// at start load the presets sounds for each key div
loadSounds();
loadEffects();











// Test
var testbutton = document.querySelector('button.test');
var testsound = new Pizzicato.Sound({
  source: 'file',
  options: { path: 'sounds/openhat.wav', attack: 0 }
});
testbutton.addEventListener('click', function(e) {
  testsound.addEffect(effects['delay']);
  testsound.effects[0].feedback = 0.3; //!!!!
  console.log(testsound.effects[0].feedback);
  testsound.play();
});

/*
var clap = new Pizzicato.Sound('sounds/clap.wav');
//var sound = new Pizzicato.Sound('./audio/sound.wav', function() {...});
var boom = new Pizzicato.Sound('sounds/boom.wav');
//console.log(clap, boom);
//clap.play();

window.onload = function() {
  pads['clap'] = clap;
  pads['boom'] = {path: 'sounds/boom.wav', play: boom.play };
}
*/


/*
function playSound(e) {
  // select audio element based on event keycode
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  // the key div
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  // if no audio do nothing and stop
  if (!audio) return;
  // else: add class playing to the key div, play the audio from beginning
  key.classList.add('playing');
  audio.currentTime = 0;
  audio.play();
}

function playSound(e) {
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  var path = key.dataset.sound;
  if (!path) return;
  key.classList.add('playing');
  var sound = new Pizzicato.Sound({
    source: 'file',
    options: { path: path }
  }, function() {
    console.log('sound file loaded!');
  });
  //sound.play();
  console.log(sound);
};

*/
