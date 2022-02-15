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
    })

    
})

module.exports = router;
