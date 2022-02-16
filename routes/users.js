var express = require('express');
const { asyncHandler, csrfProtection, getDate } = require('./utils');
const db = require('../db/models');
var router = express.Router();

/* GET users listing. */

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/');
});

router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const questionDate = getDate;
  const userId = parseInt(req.params.id, 10);
  console.log(userId)
  const questions = await db.Question.findAll({
    include: [db.User],
    where: {
      userId
    },
    order: [['updatedAt', 'DESC']]
  });
  const user = db.User.username

  res.render('profile-page', {
    user,
    questions,
    questionDate
  })

}));
module.exports = router;
