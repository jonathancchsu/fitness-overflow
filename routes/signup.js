const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');
const { asyncHandler, csrfProtection } = require('./utils');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/', csrfProtection, (req, res) => {
    //const user = await db.User.build();
    res.render('sign-up', {
      title: 'Sign-up',
      csrfToken: req.csrfToken(),
    });
  });

  const registerValidators = [
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('Are you not named?')
      .isLength({ max: 50 })
      .withMessage('Your name cannot be that long.'),
    check('email')
      .exists({ checkFalsy: true })
      .withMessage('Please provide an email address. We won\'t send you emails. We don\'t know how. (yet)')
      .isLength({ max: 255 })
      .withMessage('That email is way too long.')
      .isEmail()
      .withMessage('That email probably doesn\'t exist.')
      .custom((value) => {
        return db.User.findOne({ where: { email: value } })
          .then((user) => {
            if (user) {
              return Promise.reject('Email address already in use.');
            }
          });
      }),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Provide a password.')
      .isLength({ max: 50 })
      .withMessage('That\'s way too long. Make a password you\'ll remember. (Less than 50 characters long).')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
      .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
    check('confirmPassword')
      .exists({ checkFalsy: true })
      .withMessage('Ensure you know your password.')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Confirmed password does not match password.');
        }
        return true;
      }),
  ];

  router.post('/', csrfProtection, registerValidators,
  asyncHandler(async (req, res) => {
    const {
      email,
      username,
      password,
    } = req.body;

    
    const user = db.User.build({
      email,
      username
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 11);
      user.hashedPassword = hashedPassword;
      await user.save();
      loginUser(req, res, user);
      res.redirect('/');
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('sign-up', {
        title: 'Sign-up',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));


  module.exports = router;
