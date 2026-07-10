const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');

const ExpressError = require('./utils/ExpressError.js');
const listingsRouter = require('./routes/listing.js');
const flash = require("connect-flash");
const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Session options
const sessionOptions = {
  secret: 'mysupersecretcode',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // ✅ Date object
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionOptions)); // ✅ Session register kiya
app.use(flash());

app.use((req, res , next)=>{
  res.locals.success = req.flash("success");
  next();
})

// MongoDB connection
const MONGO_URL = 'mongodb://127.0.0.1:27017/travelandPlan';

main()
  .then(() => console.log('Successfully connected'))
  .catch((err) => {
    console.log('Connection failed', err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Routes
app.get('/', (req, res) => {
  res.redirect('/Listing');
});

app.use('/Listing', listingsRouter);

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
