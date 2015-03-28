var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var cheerio = require('cheerio');
var sleep = require('sleep');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/js/three.min.js', function (req, res) {
  res.sendFile(__dirname + '/js/three.min.js'); 
});

app.get('/js/planet-discovery.js', function (req, res) {
  res.sendFile(__dirname + '/js/planet-discovery.js'); 
});

http.listen(3000, function (){
  console.log('Server launched at 127.0.0.1:3000. Ctrl + C to terminate');
});

io.on('connection', function(socket) {
  socket.on('launch spider', function(msg) {
  url = 'http://en.wikipedia.org/wiki/Special:Random';
  function crawl(depth, url) {
    request(url, function(error, response, html) {
      if (!error) {
        socket.emit('new planet', url);
        if (depth == 3)
          return;
        sleep.sleep(1);
        var $ = cheerio.load(html);
        $('a').filter(function() {
          if (typeof $(this).attr('href') != 'undefined' && $(this).attr('href').match(/^https?:\/\//)) {
            console.log($(this).attr('href'));
            crawl(++depth, $(this).attr('href'));
          }
        });
      }
    });
  }
  crawl(1, url);
  }); 
});
