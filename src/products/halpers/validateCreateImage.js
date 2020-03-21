const Joi = require("joi");

const validateCreateImage = async (req, res, next) => {
  const questionRules = Joi.object().keys({
    userId: Joi.string().required(),
    file: Joi.object().required()
  });

  const result = Joi.validate(req.body, questionRules);

  if (result.error) {
    res.status(400);
    return next(result.error.details[0].message);
  }
  return next();
};

module.exports = validateCreateImage;
