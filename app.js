const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError.js');
const listingsRouter = require('./routes/listing.js');
// const Review = requie('./models/review.js');
const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/Listing', listingsRouter);

// Root route (optional - redirect to listings)
app.get('/', (req, res) => {
  res.redirect('/listings');
});

// Review



// 404 handler - koi bhi route match na ho
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
