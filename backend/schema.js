const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        category: Joi.string().allow("", null),
        amenities: Joi.alternatives().try(
            Joi.array().items(Joi.string()),
            Joi.string()
        ).allow(null),
        bedrooms: Joi.number().min(1).allow(null),
        beds: Joi.number().min(1).allow(null),
        bathrooms: Joi.number().min(0.5).allow(null),
        maxGuests: Joi.number().min(1).allow(null),
        image: Joi.any().allow("", null),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});