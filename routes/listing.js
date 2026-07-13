const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');
const { isLoggedIn, isOwner } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

const listingController = require('../controllers/listings.js');

// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(', ');
    throw new ExpressError(400, errMsg);
  }
  next();
};

router
  .route('/')
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('image[url]'),
    validateListing,
    wrapAsync(listingController.createListing),
  );

  // );

router.get('/new', isLoggedIn, listingController.renderNewForm);

router
  .route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner, // BUG FIX: ownership check ab middleware me proper tarike se hota hai
    upload.single('image'),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
