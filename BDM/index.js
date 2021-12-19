require('dotenv').config();
var debug = require('debug')('http');
var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();
var mongoose = require('mongoose');
var User = require('./models/user');
var users=require('./routes/user');
var bloods=require('./routes/blood');
const KEY = process.env.KEY;
const dburi = process.env.DBURI;



app.use(morgan('dev'));

mongoose.connect(
  dburi,
  { useNewUrlParser: true, useCreateIndex: true },
  (err) => {
    if (err) throw err;
    else console.log('Connected to database');
  }
);
app.use(express.static('public/img'));
app.use(express.static('public/json'));
app.use(express.static('public/js'));
app.use(express.static('public/css'));

app.use(cookieParser(KEY));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.render('index');
});
app.use('',users);

app.use('',bloods);


var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App listening on port ' + port + '!');
});
