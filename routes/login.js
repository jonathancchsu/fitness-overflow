const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler, csrfProtection } = require('../utils.js');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { loginUser } = require('../auth.js');

const loginValidations = [
    check('email')
        .exists({ checkFalsy: true })
        .withMessage('Please enter an email address to log in.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a password to log in.')
]

router.get('/', csrfProtection, function (req, res, next) {
    res.render('login', {
     title: 'Login',
     csrfToken: req.csrfToken()
    });
});

router.post('/', csrfProtection, loginValidations,
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
                return res.redirect('/');
            }
        }
        errors.push('Cannot find a valid user with the provided email and passwords.');
    } else {
        errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render('login', {
        title: 'Login',
        email,
        errors,
        csrfToken: req.csrfToken(),
    });
}));

module.exports = router;
