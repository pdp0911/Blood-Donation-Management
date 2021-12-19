var express = require('express');
var debug = require('debug')('http');
var router=express.Router();
var User = require('../models/user');
const escapeRegExp = (string) => {
    console.log(string)
    string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    console.log(string)
    return string;
  };
router.post('/donate', (req, res) => {
    if (req.body.amount == undefined || req.body.amount <= 0) {
      res.redirect('back');
      return;
    }
    User.findOne({ phone: req.signedCookies.user }, function (err, user) {
      if (err) res.send(err);
      if (!user) {
        res.redirect('/logout');
        console.error('WTF should not happen.');
        return;
      }
      user.amount += parseFloat(req.body.amount);
      user
        .save({
          validateBeforeSave: true,
        })
        .then(res.redirect('/donate'))
        .catch((err) => {
          res.send(err.message);
        });
    });
  });
  
 router.get('/donate', (req, res) => {
    debug(req.signedCookies.user);
    if (req.signedCookies.user) {
      // Greet user and Ask how much to donate
      User
        .findOne({ phone: req.signedCookies.user })
        .then((user) => {
          if (user == null) {
            // Should not happen
            console.error('WTF should not happen.');
            res.redirect('/logout');
          } else {
            debug(
              user.createdAt,
              user.updatedAt,
              user.createdAt - user.updatedAt
            );
            res.render('donate', {
              user: {
                name: user.name,
                amount: user.amount,
                lastDonated:
                  user.createdAt - user.updatedAt == 0
                    ? 'Never.'
                    : user.updatedAt,
              },
            });
          }
        })
        .catch((err) => {
          console.error(err);
          res.send(err.message);
        });
    } else {
      res.redirect('/register');
    }
  });
  
  router.get('/bank', (req, res) => {
    if (req.signedCookies.user == null) {
      res.redirect('/register');
      return;
    }
      console.log(req.query);
    if (req.query.blood == undefined || req.query.blood == '')
      req.query.blood = '(A|B|O|AB)';
  
    if (req.query.rh != undefined) req.query.blood += escapeRegExp(req.query.rh);
    else req.query.blood += '[\\+-]';
    console.log(req.query.blood)
    if (req.query.city == undefined) req.query.city = '';
  
    var page = req.query.page;
    if (page === undefined || page < 1) page = 1;
    var query;
    if(req.query.blood==='A+' || req.query.blood=='A-')
    {
      query = {
        $and: [
          { bloodGroup:req.query.blood},
          { city: { $regex: req.query.city, $options: 'i' } },
        ],
      };
    }
    else if(req.query.blood==='B+' || req.query.blood=='B-')
    {
      query = {
        $and: [
          { bloodGroup:req.query.blood},
          { city: { $regex: req.query.city, $options: 'i' } },
        ],
      };
    }
    else if(req.query.blood==='AB+' || req.query.blood=='AB-')
    {
      query = {
        $and: [
          { bloodGroup:req.query.blood},
          { city: { $regex: req.query.city, $options: 'i' } },
        ],
      };
    }
    else if(req.query.blood==='O+' || req.query.blood=='O-')
    {
      query = {
        $and: [
          { bloodGroup:req.query.blood},
          { city: { $regex: req.query.city, $options: 'i' } },
        ],
      };
    }
    else
    {
      query = {
        $and: [
          { bloodGroup: { $regex: req.query.blood, $options: 'i' } },
          { city: { $regex: req.query.city, $options: 'i' } },
        ],
      };
    }
    
  
    User.find(
      query,
      null,
      {
        sort: {
          amount: -1,
        },
        limit: 18,
        skip: (page - 1) * 18,
      },
      function (err, docs) {
        if (err) res.send(err);
        res.render('bank', { docs: docs, logged: req.signedCookies.user });
      }
    );
  });
  module.exports=router;