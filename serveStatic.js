const fs = require("fs");

module.exports = function serveStatic(req, res) {

  // extensions to MIME types
  const mimeType = {
    'ico': 'image/x-icon',
    'html': 'text/html',
    'js': 'text/javascript',
    'json': 'application/json',
    'css': 'text/css',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'wav': 'audio/wav',
    'mp3': 'audio/mpeg',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'eot': 'appliaction/vnd.ms-fontobject',
    'ttf': 'aplication/font-sfnt'
  };

  var path;
  if (req.url === '/') path = './index.html';
  else path = `.${req.url}`;

  fs.exists(path, function (exist) {
    if(!exist) {
      // if file doesn't exist
      console.log(`File ${path} not found!`);
    } else {
      fs.readFile(path, function(err, data) {
        if(err) {
          console.log(`There was an error reading the file: ${err}.`);
        } else {
          // extract the extension, write header with correct mime type, read and send.
          var ext =  path.split('.').pop();
          res.writeHead(200, {'Content-Type': mimeType[ext]});
          fs.createReadStream(path).pipe(res);
        }
      });
    }
  });
}
