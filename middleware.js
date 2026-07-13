const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You need to login first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  // BUG FIX: pehle agar session me redirectUrl set nahi tha,
  // to res.locals.redirectUrl "undefined" hi rehta tha aur
  // login/signup ke baad res.redirect(undefined) chalta tha.
  res.locals.redirectUrl = req.session.redirectUrl || '/Listing';
  next();
};

// BUG FIX: pehle ye function khaali tha — na next() call hoti thi,
// na koi check. Isse koi bhi listing kisi ka bhi edit/delete kar
// sakta tha (ya route hamesha hang ho jaata agar use hota).
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Listing you requested does not exist!');
    return res.redirect('/Listing');
  }

  if (!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
    req.flash('error', "You don't have permission to do that!");
    return res.redirect(`/Listing/${id}`);
  }

  next();
};

// BUG FIX: "Listing" model import hi nahi tha yaha (crash on use).
// Naam "isReviewAuthor" tha lekin logic listing ka owner check kar
// raha tha, review ka author nahi — fix kiya taaki review ke
// actual author se hi match ho.
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash('error', 'Review not found!');
    return res.redirect(`/Listing/${id}`);
  }

  if (!review.author || !review.author.equals(res.locals.currUser._id)) {
    req.flash('error', 'You are not the author of this review!');
    return res.redirect(`/Listing/${id}`);
  }

  next();
};
