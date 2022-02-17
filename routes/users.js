var express = require('express');
const { asyncHandler, csrfProtection, getDate } = require('./utils');
const db = require('../db/models');
var router = express.Router();
// const { logoutUser } = require('../auth.js');

/* GET users listing. */

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/');
});

router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const questionDate = getDate;
  const userId = parseInt(req.params.id, 10);
  const questions = await db.Question.findAll({
    include: [db.User],
    where: {
      userId
    },
    order: [['updatedAt', 'DESC']]
  });
  res.render('profile-page', {
    questions,
    questionDate
  })

}));
module.exports = router;
