var express = require('express');
var sqlite = require('sqlite3').verbose();
var dl = require('download');
var fs = require('fs');

var db = new sqlite.Database('.data/file.db', function (err) {
  if (err) throw err;
  
  loadExtensions();
});

function loadExtensions() {
  // Update this with your own shared-object-as-gomix-asset url
  
  var assetURL = 'https://cdn.gomix.com/bb6ced7a-bd71-4166-bea3-be8277c44115%2Flibmath.so';
  
  // Local path in persistent gomix .data directory
  
  var path = __dirname + '/.data/libmath.so';
  
  // You might need this if you bork something and want to force a redownload
  // fs.unlinkSync(path);
  
  if (!fs.existsSync(path)) {
    console.log('sqlite extension not found; downloading');
  
    dl(assetURL).then(data => {
      console.log(data);
      fs.writeFileSync(path, data);
      console.log('sqlite extension downloaded to project data')
      loadExtensionAt(path);
    }).catch(err => {
      console.error('sqlite extension failure:', err);
    })
  } else {
    loadExtensionAt(path);
  }
}

function loadExtensionAt(path) {
  console.log('loading sqlite extension:', path);
  db.loadExtension(path, (err) => {
    if (err) {
      console.log('sqlite load extension failed!', err)
    } else {
      console.log('sqlite extension loaded!');
    }
  });
}

var app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Get config data for building sqlite extensions

app.get('/config', function (req, res) {
  const os = require('os');
  
  db.all('select sqlite_version() as ver', function (err, rows) {
    res.send({
      versions: process.versions,
      arch: os.arch(),
      platform: os.platform(),
      sqlite_version: rows[0].ver
    });
  });
});

// A test of calling the sqlite extension function power for 2^8=256

app.get("/pow", function (request, response) {
  db.all('select power(2, 8) as x', function (err, rows) {
    if (err)
      response.status(500).send({ err });
    else 
      response.send({ x: rows[0].x });
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
