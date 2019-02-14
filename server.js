const http = require("http");
const fs = require("fs");

const serveStatic = require('./serveStatic.js');
var routes = require('./routes.js');


// the web server //
http.createServer(function(request, response) {

  console.log(`Request made: ${request.method} ${request.url}`);

  var routeIndex = isInRoutes(request.url);
  if (!routeIndex) {
    // if request.url is not in routes, serve static files
    serveStatic(request, response);
  } else {
    // if it is, handle the api request
    routes[routeIndex].handler(request, response);
  }

}).listen(8000);
console.log("Server listening on port 8000...");


// helper
function isInRoutes(url) {
  // return the index of the matched route or return undefined
  for(var i = 0; i < routes.length; i++) {
    if (routes[i].url === url ) return i;
  }
}
