const csrf = require('csurf');

const {validationResult} = require("express-validator");

const csrfProtection = csrf({ cookie: true});

const asyncHandler = (handler) => (req, res, next) =>
    handler(req, res, next)
        .catch(next);

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => error.msg);

        const err = Error("Bad request.");
        err.status = 400;
        err.title = "Bad request.";
        err.errors = errors;
        return next(err);
    }
    next();
};

const getDate = (date) => {
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const redirectToUser = (req, res) => {
    return res.redirect(`./users/${res.locals.user.id}`)
}

module.exports = { csrfProtection, asyncHandler, handleValidationErrors, getDate, redirectToUser};
