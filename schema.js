const Joi = require('joi');

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow('', null),
    image: Joi.object({
      filename: Joi.string().allow('', null),
      url: Joi.string().uri().allow('', null),
    }),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

module.exports = { listingSchema };
