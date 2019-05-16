const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport')(passport);
const userController = require('../controllers').User;
const questionController = require('../controllers').Questions;
module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
      message: 'Welcome to the API!',
    }));

    app.post('/api/user/signup', userController.signup);
    app.post('/api/login', userController.login);
    app.get('/api/user',passport.authenticate('jwt', { session: false}), userController.user);
    
};