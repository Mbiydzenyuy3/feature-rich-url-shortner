import Joi from "joi";

const shortenUrlSchema = Joi.object({
  longUrl: Joi.string().uri().required().messages({
    "string.base": "The longUrl must be a string.",
    "string.uri": "The longUrl must be a valid URI.",
    "any.required": "The longUrl field is required.",
  }),
  customCode: Joi.string().optional().messages({
    "string.base": "The customCode must be a string.",
  }),
  expireInDays: Joi.number().integer().optional().min(1).messages({
    "number.base": "ExpireInDays must be a number.",
    "number.min": "ExpireInDays must be at least 1.",
  }),
});

export default shortenUrlSchema;
