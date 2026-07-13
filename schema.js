const Joi = require('joi');

// Form fields aate hain flat structure me (title, price, ...),
// isliye schema bhi flat rakha hai. "listing.xxx" wala nested
// structure form ke actual data se match hi nahi karta tha.
const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  image: Joi.object({
    url: Joi.string().allow('', null),
    filename: Joi.string().allow('', null),
  })
    .unknown(true)
    .optional(),
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});

module.exports = { listingSchema, reviewSchema };
