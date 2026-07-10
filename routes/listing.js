const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const { listingSchema } = require('../schema.js');
const Review = require("../models/review.js");
// Validation middleware
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
router.get(
  '/',
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render('Listing/index.ejs', { allListings });
  }),
);

// New listing form
router.get('/new', (req, res) => {
  res.render('Listing/new.ejs');
});

// Show route - ek listing
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      throw new ExpressError(404, 'Listing Not Found');
    }
    res.render('Listing/show.ejs', { listing });
  }),
);

// Create route - naya listing save karna
router.post(
  '/',
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body);
    await newListing.save();

    req.flash("success" , "New Listing Created !");

    res.redirect('/Listing');
  }),
);

// Edit route - form dikhana
router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, 'Listing Not Found');
    }
    res.render('Listing/edit.ejs', { listing });
  }),
);

// Update route
router.put(
  '/:id',
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect('/listing');
  }),
);

// Delete route
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listing');
  }),
);


// router.post('/:id/reviews', async (req, res) => {
//   let listing = await Listing.findById(req.params.id);

//   let newReview = new Review(req.body.review);

//   listing.review.push(newReview);

//   await newReview.save();
//   await listing.save();
//   res.send(' new review sahved ');
// });


router.post(
  '/:id/reviews',
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview); // <-- 'reviews' plural
    await newReview.save();
    await listing.save();
    res.redirect(`/Listing/${req.params.id}`); // send back to show page
  }),
);

router.delete("/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{  // '/' missing tha
  let {id , reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});  // 'reivews' typo fix
  await Review.findByIdAndDelete(reviewId);  // capital 'Review' model
  res.redirect(`/Listing/${id}`);  // capital 'Listing'
}));



module.exports = router;
