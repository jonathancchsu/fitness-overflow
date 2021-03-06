const express = require('express');
const createError = require('http-errors');
const { asyncHandler, csrfProtection, getDate } = require('./utils');
const db = require('../db/models');
const router = express.Router();
const { logoutUser } = require('../auth.js');

/* GET users listing. */



router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const userId = parseInt(req.params.id, 10);
  const user = db.User
    // console.log(res.locals.user.id);
  const questionDate = getDate;
  const questions = await db.Question.findAll({
    include: [db.User],
    where: {
      userId
    },
    order: [['updatedAt', 'DESC']]
  });
  const usern = await db.User.findByPk(userId)
  const username = usern.username
  res.render('profile-page', {
    res,
    user,
    questions,
    questionDate,
    userId,
    username
  })




  // else{
  //   res.redirect('/');
  // }


router.post('/logout', (req, res) => {
    logoutUser(req, res);
    console.log(req.session.auth);
    res.redirect('/');
  });

}));
module.exports = router;
