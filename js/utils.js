/*
Eventually make more files, utils, music, effects, ecc.
and use IIFE (es in get programming book) to export function, without being on the global scopeF

*/
/* Lesson learned

all the flow of abstracting the api call. See below apiGET function

*/


// helper to cut the sound sound title
function cutTitle(title) {
  title = title.replace(/\.[^/.]+$/, "");
  if (title.length > 8) {
    title = title.slice(0,7) + "..";
  }
  return title;
}

function domReady(callback) {
  // Sanity check
  if (typeof callback !== 'function') {
    console.error('ERROR: domReady needs a function');
    return;
  }
  // If document is already loaded, run method
  if (document.readyState === 'complete') {
      return callback();
  }
  // if not, wait until document is loaded
  document.addEventListener('DOMContentLoaded', callback, false);
};


// STYLE FUNCTIONS

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('playing');
}


// HTTP FUNCTIONS
/*
// helper function for XHR GET requests
function apiGET(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);
  return xhr.responseText;
}
*/
/* async, but doesnt return the json
function apiGET(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.addEventListener("load", function() {
    return xhr.responseText;
  });
  xhr.send(null);
} */

/* nooooooooo
function apiGET(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.addEventListener("load", callback(xhr.responseText));
  xhr.send(null);
} */

// IMPORTANT: check eloquentJS 2nd Ed chapter 17 paragraph 'Abstracting requests'
// for the use of callback here --it was the lesson learned here! follow the flow:
// 1- main.js calls apiGET giving url and callback. 2- here we call callback INSIDE the load event handler callback! passing responseText as argument 3- callback function (for ex: loadPresetSounds below) receives the arg (same ex: presets)
// and for more about Error handling in asynchronous code
function apiGET(url, callback) {
  console.log('inside apiGET', url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.addEventListener("load", function() {
    if (xhr.status < 400) {
      // if loading was successful
      callback(JSON.parse(xhr.responseText));
    } else {
      // this should be improved. it's not a comm err, it's an error while ?? And i should add a second callback to handle error instead of using console.log
      console.log('Communication error with API');
    }
  });
  xhr.send(null);
}





// MUSIC FUNCTIONS

// SOUNDS

function loadPlaylist(ev) {
  name = ev.target.previousSibling.nodeValue;
  var playlist = JSON.parse(apiGET("/api/playlists/"+name));
  console.log(playlist);
}

// apiGET(`/api${folder}`);
function loadPresetSounds(presets) {
  console.log('arg of loadPresetSounds', presets);

  keys.forEach(function(key) {
    // the key div kbd
    var kbd = key.dataset.kbd;
    // extract the sound path from presets object (which was passed from apiGET)
    var path = presets[kbd].path;
    // load the sound into pads obj
    pads[kbd].sound = new Pizzicato.Sound({
      source: 'file',
      options: { path: path, attack: 0 }
    });
    // extract the soundTitle from presets data
    var soundTitle = presets[kbd].name;
    // insert sound title inside the pad span.sound
    var key = document.querySelector(`div[data-kbd="${kbd}"]`);
    key.children[1].textContent = cutTitle(soundTitle);
  });

  console.log("done with loading all pads");
}

function createSoundList(sounds) {
  console.log('arg of createSoundList', sounds);
  // get the soundList UL
  var soundList = document.getElementById('soundList');
  // for each sound category create a LI and for each sound create UL e LI to append to the category LI
  // finally the full LI is appended to the soundList UL
  for (var key in sounds) {
    // category li
    var node = document.createElement("LI");
    var textnode = document.createTextNode(key);
    node.appendChild(textnode);
    // sound li
    var nestedUl = document.createElement("UL");
    sounds[key].forEach(function(sound) {
      var nestedLi = document.createElement("LI");
      nestedLi.classList.add("dndSound");
      var spanEl = document.createElement("SPAN");
      var soundText = document.createTextNode(sound.name);
      var buttonEl = document.createElement("BUTTON");
      buttonEl.classList.add("preview-btn");
      var buttonText = document.createTextNode("play");

      nestedUl.appendChild(nestedLi).appendChild(spanEl).appendChild(soundText);
      nestedLi.appendChild(buttonEl).appendChild(buttonText);
      node.appendChild(nestedUl)
    });

    soundList.appendChild(node);
  }
}

function createPlaylistList(folder) {
  var playlists = JSON.parse(apiGET(`/api${folder}`));
  var setList = document.getElementById('setList');
  for (key in playlists) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(key);
    node.appendChild(textnode);
    var button = document.createElement("BUTTON");
    button.classList.add("loadit-btn");
    var buttonText = document.createTextNode("load it!");
    node.appendChild(button).appendChild(buttonText);
    setList.appendChild(node);
  }
}

function playSound(e) {
  const keyCodePads = [65, 83, 68, 70, 71, 72, 74, 75, 76];

  if (keyCodePads.includes(e.keyCode)) {
    // the pressed key div
    var key = document.querySelector(`div[data-key="${e.keyCode}"]`);
    // the pressed kbd
    var kbd = key.dataset.kbd;
    // add class for animation
    key.classList.add('playing');
    //console.log(pads[kbd].sound);
    // stop it before to ensure it plays from beginning
    pads[kbd].sound.stop();
    pads[kbd].sound.play();
  }

}

function previewSound(ev) {
  var btn = ev.target;
  var soundTitle = btn.previousSibling.innerText;
  var catTitle = btn.parentElement.parentElement.parentElement.childNodes[0].textContent;
  var soundPath = "sounds/"+catTitle+"/"+soundTitle;
  console.log(soundPath);

  if (prevSound) {
    prevSound.stop();
    prevSound = null;
  }
  prevSound = new Pizzicato.Sound({
    source: 'file',
    options: { path: soundPath, attack: 0 }
  }, function(er) {
    if (er) {
      alert("There was a problem loading this sound");
    }
    else {
      prevSound.play();
    }
  });
}



// EFFECTS

function loadEffects() {
  console.log("starting loadEffects");
  effects['delay'] = new Pizzicato.Effects.Delay();
  effects['reverb'] = new Pizzicato.Effects.Reverb({ time: 0.6, decay: 0.5 });
  effects['distortion'] = new Pizzicato.Effects.Distortion();
  effects['flanger'] = new Pizzicato.Effects.Flanger();
  console.log('all effects loaded');
}

// two helpers for toggleFx function below: createRanges, createChannelFx.

function createRanges(fxOptions) {
  // returns an array with a node for each effect parameters

  /* prepare the childs of channelRange (which is inside the rangeContainer)
  one template-effectParameter div for each effect parameter (to be found inside options +defaults) */

  // select the template
  var templateFxParam = document.querySelector('#template-effectParameter');
  // take the options obj of the effect
    // passed as argument
  // initialize array to save each created parameter div (inputRange)
  var nodesArray = [];
  // iterate over the effect parameters
  for (var param in fxOptions) {
    if (fxOptions.hasOwnProperty(param)) {
      // write the fx title
      var copy = templateFxParam.children[0].cloneNode(true);
      copy.querySelector('.fxTitle').textContent = param[0].toUpperCase() + param.substr(1);
      // set data-parameter
      copy.querySelector('input').setAttribute('data-parameter', param);
      // set fxValue with effect paramet defaults
      copy.querySelector('.fxValue').textContent = fxOptions[param];
      // add the event listener
      var inputElt = copy.querySelector('input');
      inputElt.addEventListener('input', adjustFX);
      // push the filled template into the array
      nodesArray.push(copy);
    }
  }
  return nodesArray;
}

function createChannelFx(kbdChannel, paramNodesArray) {
  /* insert all nodes from nodesArray inside the channel and display the effect (with all specific paramaters)
  kbdChannel maight be the global kbd */

  // select and display range container
  var rangesContainer = document.querySelector('.rangesContainer');
  if (rangesContainer.style.visibility != 'visible') rangesContainer.style.visibility = 'visible';
  // select the right channelRange
  var channel = rangesContainer.querySelector(`[data-kbd="${kbdChannel}"]`);
  // append the filled template into channelRange
  paramNodesArray.forEach(function(node) {
    //console.log(node);
    channel.appendChild(node);
  });
  // make the filled channelRange visible
  channel.style.visibility = 'visible';
}

function toggleFX(e) {
  /* load the selected effect into the channel */

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
    // take the options obj of the sound effect and create an array with a node for each effect parameter
    var fxOptions = pads[kbd].sound.effects[0].options;
    var nodesArray = createRanges(fxOptions) // prima passavo effects[effectOn].options, che ha le stesse options
    // create and display the channel effect
    createChannelFx(kbd, nodesArray);
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


// DRAGULA

function doDragula() {
  // create and set options
  var drake = dragula({
    copy:true,
    revertOnSpill: true,
    accepts: function (el, target, source, sibling) {
      return target.classList.contains("dndKey");
    }
  });
  // initialize array for remembering innerText
  var innerT = [];
  // add containers
  var fileTree = document.querySelector("#fileTree");
  var dndSounds = Array.from(fileTree.querySelectorAll(".dndSound"));
  dndSounds.forEach(function(dndSound) { drake.containers.push(dndSound); });
  var dndKeys = Array.from(document.querySelectorAll(".dndKey"));
  dndKeys.forEach(dndKey => drake.containers.push(dndKey));
  // on drop event
  drake.on('drop', function(el, target, source, sibling) {
    console.log(el, target, source, sibling);
    var kbd = target.dataset.kbd;
    console.log(kbd);
    var soundTitle = source.firstChild.textContent;
    var catTitle = source.parentElement.parentElement.childNodes[0].textContent;
    var path = "sounds/"+catTitle+"/"+soundTitle;
    console.log(pads[kbd]);
    pads[kbd].sound = new Pizzicato.Sound({
      source: 'file',
      options: { path: path, attack: 0 }
    });
    console.log(soundTitle+" loaded into pad "+kbd);
    drake.cancel();
    target.children[1].textContent = cutTitle(soundTitle);
    //alert(soundTitle+" loaded into pad "+kbd);
  });
  // on over event
  drake.on('over', function(el, container, source) {
    console.log(container);
    container.classList.add("dndOver");
    console.log(container.querySelector("span"));
  });
  // on out event
  drake.on('out', function(el, container, source) {
    console.log(container);
    container.classList.remove("dndOver");
  });
  // on drag event
  drake.on('drag', function() {
    dndKeys.forEach(function(dndKey) {
      dndKey.classList.add("dndAccept");
    })
  });
  drake.on('dragend', function() {
    dndKeys.forEach(function(dndKey) {
      dndKey.classList.remove("dndAccept");
    })
  });

}
