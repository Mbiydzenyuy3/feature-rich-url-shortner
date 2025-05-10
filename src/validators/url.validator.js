import Joi from "joi";

const shortenUrlSchema = Joi.object({
  longUrl: Joi.string().uri().required().messages({
    "string.base": "The longUrl must be a string.",
    "string.uri": "The longUrl must be a valid URI.",
    "any.required": "The longUrl field is required.",
  }),
});

export default shortenUrlSchema;
