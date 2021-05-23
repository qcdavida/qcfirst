const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const User = require('./models/User');
const courseController = require('./controllers/courseController');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');

const InitiateMongoServer = require("./config/db");
InitiateMongoServer();
const popDBcommand = require('./config/populateDB.js');
//Run these two commands, one at a time, to fill up the database with dummy info:
// popDBcommand.popDBCourses();
// popDBcommand.popDBUser();

//===============EXPRESS================

// app.set('views', path.join(__dirname, 'views')); 
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'lgm355', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.set('view engine', 'pug');

//===============PASSPORT=================
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        done(err, user);
    });
});

//to sign users up
passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
    },

    function(req, email, password, done) {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        
        process.nextTick(function() {
            User.findOne( { email: email }, function(err, user) {
                if (err)
                    return done(err);
                
                if (user)
                    return done(null, false);
                else {
                    var newUser = new User();
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.firstname = firstname;
                    newUser.lastname = lastname;
                    newUser.courses = [];
                    newUser.role = 'student';
                    
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });    
        });
    }));

//To log in users
passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
    },

    function(req, email, password, done) { 
        User.findOne({ 'email': email }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false);
            if (!user.validPassword(password))
                return done(null, false);
            return done(null, user);
    });
}));


//===============ROUTES=================

app.get('/', (req, res) => {
    res.render('index', {
        user : req.user
    });
});

app.get('/index', (req, res) => {
    res.render('index', {
        user : req.user
    });
});

app.get('/login', function(req, res) {
    res.render('login'); 
});

app.post('/login', passport.authenticate('local-login', 
    { failureRedirect : '/login' }), 
    function(req, res){
        if(!req.user)
            return res.status(404).json({message: 'Something went wrong, please try again.'});
        else {
            if(req.user.role==='admin'){
                res.redirect('/instructorhome');
            }
            else if(req.user.role==='instructor'){
                res.redirect('/instructorhome');
            }
            else{
                res.redirect('/');
            }
            }
        }
);

app.get('/signup', function(req, res){
    res.render('signup');
});

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', 
    failureRedirect : '/error'
}));

//profile is just for testing, not used in the final website
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
    user : req.user
    });
});

app.get('/enrollment', isLoggedIn, function(req, res) {
    res.render('enrollment', {
        user : req.user
    });
});

app.use('/addcourse', isLoggedIn, courseController.addPageCourselist);
app.use('/dropcourse', isLoggedIn, courseController.dropPageCourselist);
app.use('/searchform', isLoggedIn, courseController.searchPageList);
app.post('/savecourse', isLoggedIn, courseController.saveCourseToUser);
app.post('/deletecourse', isLoggedIn, courseController.deleteCourseFromUser);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


//Admin routes

app.get('/instructorhome', isLoggedIn, userController.grantAccess('readAny', 'course'), function(req, res) {
    res.render('instructorhome', {
        user : req.user
    });
});

app.use('/managecourse', isLoggedIn, userController.grantAccess('readAny', 'course'), adminController.listCourses);
app.use('/roster', isLoggedIn, userController.grantAccess('readAny', 'course'), adminController.viewRoster);

app.get('/createcourse', isLoggedIn, userController.grantAccess('createAny', 'course'), function(req, res) {
    res.render('createcourse', {
        user : req.user
    });
});

app.post('/createcourse', isLoggedIn, userController.grantAccess('createAny', 'course'), adminController.createCourse);

app.get('/deletecourse', isLoggedIn, userController.grantAccess('readAny', 'course'), adminController.listCoursesDelete);

app.post('/profdeletecourse', isLoggedIn, userController.grantAccess('readAny', 'course'), adminController.deleteCourse);

app.get('/myroster', isLoggedIn, userController.grantAccess('readAny', 'course'), adminController.displayRoster);


//Function to check if the user is still logged in

function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return next();
    else
        res.redirect('index');
}


//===============PORT=================

app.listen(3000, function() {
    console.log("Listening on port 3000");
});


module.exports = app;