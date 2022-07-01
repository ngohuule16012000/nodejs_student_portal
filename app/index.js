const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const { create } = require('express-handlebars');
const session = require('express-session');
const route = require('./routes');
const SiteMiddleware = require('./middlewares/SiteMiddleware');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./key');
const db = require('./config/db');

// connect db
db.connect();

const app = express();
const port = 3000;


passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
      },
      accessToken => {
        console.log(accessToken);
      }
    )
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // form submit body-parser
app.use(express.json());

// http logger
app.use(morgan('combined'));

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.use(upload());

// Custom middleware
app.use(SiteMiddleware);

const hbs = create({
    extname: '.hbs',
    helpers: {
        sum: (a,b) => a + b,
    },
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// route init
route(app);

app.listen(port, () => {
    console.log(`App listening on port http://localhost/${port}`);
});
