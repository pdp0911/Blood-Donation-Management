var express = require('express');
var debug = require('debug')('http');
var router=express.Router();
var path = require('path');
const KEY = process.env.KEY;
const signature = {
  signed: KEY,
  maxAge: 2 * 24 * 60 * 60 * 1000,
};
var User = require('../models/user');
  router.get('/register', (req, res) => {
    res.render('../views/register');
  });
  
  router.post('/register', (req, res) => {
    debug(req.body);
    User
      .findOne({ phone: req.body.phone })
      .then((user) => {
        if (user == null) {
          new User({
            name: req.body.name.toUpperCase(),
            bloodGroup: req.body.blood.toUpperCase() + req.body.rh,
            city: req.body.city.toUpperCase(),
            phone: req.body.phone,
            amount: req.body.amount || 0,
            address: req.body.address,
          })
            .save()
            .then((user) => {
              res.cookie('user', user.phone, signature);
              res.redirect('/donate');
            })
            .catch((err) => {
              res.send(err.message + '\nPlease go Back and try again.');
            });
        } else {
          res.cookie('user', user.phone, signature);
          res.redirect('/donate');
        }
      })
      .catch((err) => {
        res.send(err.message);
      });
  });

  router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
  });
  module.exports=router;