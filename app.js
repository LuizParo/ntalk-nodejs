var express = require('express');

var cfg = require('./config.json')
var load = require('express-load');
var cookieParser = require('cookie-parser');
var json = require('express-json');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var methodOverride = require('method-override');
var error = require('./middleware/error');
var csurf = require('csurf');
var redisAdapter = require('socket.io-redis');
var RedisStore = require('connect-redis')(expressSession);
var cookie = cookieParser(cfg.SECRET);
var store = new RedisStore({prefix: cfg.KEY});
var logger = require('express-logger');
var compression = require('compression');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(logger({
    path : "./logs/logfile.txt"
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(compression());
app.use(cookie);
app.use(expressSession({
    secret: cfg.SECRET, 
    name: cfg.KEY, 
    resave: false, 
    saveUninitialized: false,
    store : store
}));
app.use(json());
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
//app.use(csurf());
//app.use(function(req, res, next) {
//    res.locals._csrf = req.csrfToken();
//    next();
//});

io.set('log level', 1)
io.adapter(redisAdapter(cfg.REDIS));
/*io.set('authorization', function(data, accept) {
    cookie(data, {}, function(err) {
        var sessionID = data.signedCookies[cfg.KEY];
        store.get(sessionID, function(err, session) {
            if(err || !session) {
                accept(null, false);
            } else {
                data.session = session;
                accept(null, true);
            }
        });
    });
});*/
io.use(function(socket, next) {
    var data = socket.request;
    cookie(data, {}, function(err) {
        var sessionID = data.signedCookies[cfg.KEY];
        store.get(sessionID, function(err, session) {
            if(err || !session) {
                return next(new Error('not authorized'));
            } else {
                socket.handshake.session = session;
                return next();
            }
        });
    });
});

load('models')
    .then('controllers')
    .then('routes')
    .into(app);

load('sockets')
    .into(io);

app.use(error.notFound);
app.use(error.serverError);

server.listen(3000, function() {
  console.log('NTalk no ar.');
});

module.exports = app;