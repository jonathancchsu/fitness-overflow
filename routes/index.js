const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { User } = db
const { loginUser } = require('../auth.js')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { csrfProtection, asyncHandler, getDate } = require('./utils');
const { Sequelize } = require('../db/models');

/* GET home page. */
router.get('/', csrfProtection, asyncHandler(async (req, res, next) => {
    const isLoggedIn = res.locals.authenticated;
    // console.log(`\n\n\n\n\n\n${isLoggedIn}\n\n\n\n\n\n\n`)
    if (isLoggedIn) {
        const userId = res.locals.user.id;
        res.render('home.pug', {
            title: 'Fitness Overflow',
            req,
            res,
            userId,
            csrfToken: req.csrfToken()
        });
    } else {
        res.render('home.pug', {
            title: 'Fitness Overflow',
            req,
            res,
            csrfToken: req.csrfToken()
        })
    }
}));

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
                return res.redirect(`/users/${user.id}`);
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
        include: User,
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

    const questionDate = getDate;

    res.render('search', {
        title: `Results for "${query}"`,
        User,
        questions,
        questionDate,
    })
}));

module.exports = router;
