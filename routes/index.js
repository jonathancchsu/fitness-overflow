const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { loginUser } = require('../auth.js')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { csrfProtection, asyncHandler } = require('./utils');
const { Sequelize } = require('../db/models');

/* GET home page. */
router.get('/', csrfProtection, function(req, res, next) {
  console.log(res.locals.authenticated)
  res.render('home.pug', { title: 'Fitness Overflow', req, res, csrfToken: req.csrfToken()});
});

const loginValidations = [
  check('email')
      .exists({ checkFalsy: true })
      .withMessage('Please enter an email address to log in.'),
  check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a password to log in.')
]

router.post('/',
    csrfProtection,
    loginValidations,
    asyncHandler(async (req, res) => {
    const {
        email,
        password,
    } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        const user = await db.User.findOne({ where: { email } });

        if (user !== null) {
            const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

            if (passwordMatch) {
                loginUser(req, res, user);
                return res.redirect('/questions');
            }
        }
        errors.push('Cannot find a valid user with the provided email and passwords.');
    } else {
        errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render('home.pug', {
        title: 'Login',
        email,
        errors,
        csrfToken: req.csrfToken(),
    });
}));

router.get('/search', asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (query === '') {
        return res.render('search', {title:'Nothing was entered in search bar.', questions: []})
    }
    const questions = await db.Question.findAll({
        where: {
            [Sequelize.Op.or]: [
              {
                  title: {
                      [Sequelize.Op.iLike]: `%${query}%`,
                  },
              },
              {
                  body: {
                      [Sequelize.Op.iLike]: `%${query}%`,
                  },
              },
            ],
        },
        order: [['updatedAt', 'DESC']],
    });

    res.render('search', {title: `Results for "${query}"`, questions})
}));

module.exports = router;
