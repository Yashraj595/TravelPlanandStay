const express = require('express');
// mergeParams: true zaruri hai taaki parent route ka ":id" (listing id) yaha bhi mil sake
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');

// Create review
router.post('/', isLoggedIn, wrapAsync(reviewController.createReview));

// Delete review
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview),
);

module.exports = router;
