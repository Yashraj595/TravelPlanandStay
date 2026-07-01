const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing.js');

const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js'); // apna file path daalo
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

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
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(', ');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
// Index route - saari listings
app.get(
  '/Listing',
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render('Listing/index.ejs', { allListings });
  }),
);

// create new post
app.get('/Listing/new', validateListing, (req, res) => {
  console.log('new post create ho sakta hai');
  res.render('Listing/new.ejs');
});

// Show route - ek listing
app.get(
  '/Listing/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, 'Listing Not Found');
    }
    res.render('Listing/show.ejs', { listing });
  }),
);

// post request for new post
app.post(
  '/Listing/new',
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect('/Listing');
  }),
);

// Edit Route
app.get(
  '/Listing/:id/edit',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listingg = await Listing.findById(id);
    if (!listingg) {
      throw new ExpressError(404, 'Listing Not Found');
    }
    res.render('Listing/edit.ejs', { listingg });
  }),
);

// Update Route
app.put(
  '/Listing/:id',
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect('/Listing');
  }),
);

// delete route
app.delete(
  '/Listing/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/Listing');
  }),
);

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
