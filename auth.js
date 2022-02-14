const { User } = require('./db/models');

const loginUser = (req, user) => {
    req.session.auth = { userId: user.id};
    req.session.save(() => res.redirect('/'));
};

const logoutUser = (req) => {
    delete req.session.auth;
    req.session.save(() => res.redirect('/'));

};

const restoreUser = async (req, res, next) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;

        try {
            const user = await User.findByPk(userId);

            if(user){
                res.locals.verified = true;
                res.locals.user = user;
                next();
            }
        }
        catch (err) {
            res.locals.verified = false;
            next(err);
        }
        } else {
         res.locals.verified = false;
        next();
    }
}   

const requireAuth = (req, res, next) => {
    if(!res.locals.verified) {
        return res.redirect('./login')
    }

    next();

}


module.exports = { loginUser, logoutUser, restoreUser, requireAuth };
