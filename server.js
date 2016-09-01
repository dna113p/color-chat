var express = require('express');
var app = express();
var server = require('http').createServer(app);

var bodyParser  = require('body-parser');

var port = process.env.PORT || 8080;

//Uncomment for webpack dev server middleware
//==========================================================
//var webpack = require('webpack');
//var webpackDevMiddleware = require('webpack-dev-middleware');
//var webpackHotMiddleware = require('webpack-hot-middleware');
//var config = require('./config/webpack.config.dev.js');
//var compiler = webpack(config);

//app.use(webpackDevMiddleware(compiler, {
//publicPath: config.output.publicPath,
//stats: {colors: true}
//}))
//app.use(webpackHotMiddleware(compiler, {
//log: console.log
//}))
//==========================================================


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Pull static assets from build folder
app.use(express.static('build'));
var server = app.listen(port);
console.log('Listening on port: ' + port);
var io = require('socket.io')(server);

var colors = []

io.on('connection', function (socket) {
  var hasColor = false;
  var index = null;

  //Client sends a new message
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    io.emit('new message', {
      color: socket.color,
      text: data,
      timestamp: Date.now()
    });
  });

  //Client sends a color request
  socket.on('request color', function (color) {
    if (hasColor) return;
    if (colors.indexOf(color) == -1){

      //Store the color in the socket
      socket.color = color;
      index = colors.length;
      colors.push(color);
      hasColor = true;
      socket.emit('connected', {
        color: color
      });

      //Broadcast connected user message
      io.emit('new message', {
        color: socket.color,
        text: socket.color + ' has connected',
        timestamp: Date.now()
      });
    }
    else {
      socket.emit('socket in use');
    }
  });

  //Handle a user disconnect
  socket.on('disconnect', function () {
    if (hasColor) {
      colors.splice( index, 1);

      //Broadcast disconnect message
      io.emit('new message', {
        color: socket.color,
        text: socket.color + ' has disconnected',
        timestamp: Date.now()
      });
    }
  });
});

app.get('/api/getColors', function(req, res, next){
  res.json({"data": JSON.stringify(colors)});
});


