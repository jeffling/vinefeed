"use strict";
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Vinefeed' });
};

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};