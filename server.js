var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var open = require('open');

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

var port = process.env.PORT || 8080;

var router = express.Router();

// Pull static assets from build folder
app.use(express.static('build'));

// Middleware for server sent events. To send Messages.
app.use(function(req, res, next) {
  res.sseSetup = function() {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
  }
  res.sseSend = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };
  next();

});


//Global objects instead of DB
var MESSAGES = [];
var CONNECTIONS = [];
var COLORS = [];

//Registering Routes below.
//=============================
//

router.route('/message').post(function(req, res) {
  //Write messages and brodacst them
  writeMessage(req.body.message.text, req.body.message.color);
  console.log('"' + req.body.message.text + '" from ' + req.body.message.color);
  broadcastMessages(CONNECTIONS);
  res.end('success');
});


//Register a new color at this route.
router.route('/registerColor').post(function(req,res) {

  //Add new color to app
  if(COLORS.indexOf(req.body.color) == -1){
    //Broadcast a conenct message
    var i = COLORS.length;
    COLORS.push(req.body.color);
    var text = req.body.color + " has connected.";
    console.log( text );
    writeMessage(text, req.body.color);
    broadcastMessages(CONNECTIONS);

    //Keep this connection alive so we can disconnect users
    res.writeHead(200,{'Connection': 'keep-alive'});
    res.on("close", close);
    res.on("end", close);

    function close() {
      if (i > -1) COLORS.splice( i, 1);
      writeMessage( req.body.color+" has disconnected.", req.body.color);
      console.log( req.body.color+" has disconnected." );
      broadcastMessages(CONNECTIONS);
    };
  }
  //Return an error if we already have requested color
  else {
    res.sendStatus(400);
  }

});

router.route('/getColors').get(function(req,res) {
  res.json({"data": JSON.stringify(COLORS)});
});


router.route('/stream').get(function(req,res) {
  res.sseSetup();
  res.sseSend(MESSAGES);
  CONNECTIONS.push(res);
});


app.use('/api', router);

// Start Serer
var server = app.listen(port);
// Timeout connections after an hour
server.timeout = 60 * 60 * 1000;
console.log('Listening on port: ' + port);
open('http://localhost:8080');


//Helper functions for writing and broadcasting messages
function broadcastMessages(connections) {
  connections.forEach(function(connection) {
    connection.sseSend(MESSAGES)
  });
}

function writeMessage(text,color) {
  var message = {
    color: color,
    text: text,
    timestamp: Date.now()
  };
  MESSAGES.push(message);
}
