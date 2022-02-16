var express = require('express');
const { asyncHandler, csrfProtection } = require('./utils');
const db = require('../db/models');
var router = express.Router();

/* GET users listing. */
router.get('/:id', asyncHandler(async function(req, res, next) {
  const userId = req.params.id;
  const user = await db.User.findByPk(userId);

  if (user) {

  } else {

  }
  
  res.send('respond with a resource');
}));

module.exports = router;
