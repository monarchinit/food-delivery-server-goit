const Joi = require("joi");

const validateUserBody = async (req, res, next) => {
  const questionRules = Joi.object().keys({
    user: Joi.required(),
    products: Joi.required(),
    deliveryType: Joi.string().required(),
    deliveryAdress: Joi.string().required()
  });

  const result = Joi.validate(req.body, questionRules);
  if (result.error) {
    res.status(400);
    return next(result.error.details[0].message);
  }
  return next();
};

module.exports = validateUserBody;
