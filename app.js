if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

const ExpressError = require('./utils/ExpressError.js');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStategy = require('passport-local');
const User = require('./models/user.js');

const listingsRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// MongoDB connection URL
const dbURL = process.env.ATLASDB;

// Session store (MongoDB me sessions save karne ke liye)
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // for Lazy Update
});

store.on('error', (err) => {
  console.log('ERROR in Mongo session store', err);
});

// Session options
const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

main()
  .then(() => console.log('Successfully connected'))
  .catch((err) => {
    console.log('Connection failed', err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(dbURL);
}

// Routes
app.get('/', (req, res) => {
  res.redirect('/Listing');
});

app.use('/Listing', listingsRouter);
app.use('/Listing/:id/reviews', reviewRouter);
app.use('/', userRouter);

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid Listing ID';
  }
  res.status(statusCode).render('error.ejs', { statusCode, message });
});

app.listen(5000, () => {
  console.log('Server is running at port 5000');
});
