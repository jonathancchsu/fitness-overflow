const express = require('express');
const { asyncHandler, csrfProtection, getDate } = require('./utils');
const db = require('../db/models');
const router = express.Router();
const { logoutUser } = require('../auth.js');

/* GET users listing. */



router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  if(res.locals.authenticated){
    const userId = parseInt(req.params.id, 10);
    console.log(userId);
    console.log(res.locals.user.id);
    if(res.locals.user.id === userId){
  const questionDate = getDate;
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
  })}
  else {
    
    res.redirect('/');
  }}
  else{
    res.redirect('/');
  }


router.post('/logout', (req, res) => {
    logoutUser(req, res);
    console.log(req.session.auth);
    res.redirect('/');
  });

}));
module.exports = router;
