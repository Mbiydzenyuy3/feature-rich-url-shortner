import Joi from "joi";

const shortenUrlSchema = Joi.object({
  longUrl: Joi.string().uri().required(),
  expireInDays: Joi.number().integer().min(1).max(365).optional(),
});

export default shortenUrlSchema