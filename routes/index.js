var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout.pug', { title: 'Fitness Overflow' });
});

module.exports = router;
