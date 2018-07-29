const fs = require("fs");

// helpers:
// send responses with a single function call
function respond(response, status, data, type) {
  response.writeHead(status, {
    "Content-Type": type || "text/plain"
  });
  response.end(data);
}

function respondJSON(response, status, data) {
  respond(response, status, JSON.stringify(data), "application/json");
}

// read sound folder and create json representation
function readSoundFolder() {
  var folder = "./sounds";
  var result = {};

  var dirArray = fs.readdirSync(folder);
  dirArray.forEach(function(dir) {
    var files = fs.readdirSync(folder+"/"+dir);
    result[dir] = [];
    files.forEach(function(file) {
      result[dir].push({name: file, path: folder+"/"+dir+"/"+file});
    });
  });
  return JSON.stringify(result);
}


// The routes
var routes = [
  // dummy route, doesnt work because being routes[0] in web server routeIndex equals to 0 and become false at the if condition
  { method: 'GET',
    url: '/dummy',
    handler: function(request, response) {
      console.log('You are at route 0');
    }
  },
  // api welcome page
  { method: 'GET',
    url: '/api',
    handler: function(request, response) {
      var html = '<h1>Web Drum Pads API Home Page</h1><p>Endpoints: "/api/sounds", "/api/playlists/presets"</p>';
      respond(response, 200, html, "text/html");
    }
  },
  // get list of all sounds
  { method: 'GET',
    url: '/api/sounds',
    handler: function(request, response) {
      var sounds = JSON.parse(readSoundFolder());
      respondJSON(response, 200, sounds);
    }
  },
  // get preset sounds
  { method: 'GET',
    url: '/api/playlists/presets',
    handler: function(request, response) {
      var playlist = JSON.parse(fs.readFileSync("playlists/presets.json"));
      respondJSON(response, 200, playlist);
    }
  },
  // get list of all playlists. NOT USED YET
  { method: 'GET',
    url: '/api/playlists',
    handler: function(request, response) {
      console.log('/api/playlists handler started. It should not be used at the moment.');
      /*
      var playlists = fs.readdirSync("playlists");
      console.log(playlists);
      var obj = {};
      playlists.forEach(function(pl) {
        obj[pl.replace(/\.[^/.]+$/, "")] = "./playlists/"+pl;
      });
      respondJSON(response, 200, obj); */
    }
  }
];

module.exports = routes;
