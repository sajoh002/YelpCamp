const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.nationalParkSchema = Joi.object({
  nationalPark: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.string().required().escapeHTML(),
    pricePer: Joi.string().required().escapeHTML(),
    state: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.hikeSchema = Joi.object({
  hike: Joi.object({
    title: Joi.string().required().escapeHTML(),
    distance: Joi.number().required().min(0),
    difficulty: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    nationalPark: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
