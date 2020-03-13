const Joi = require("joi");

const validateUserBody = async (req, res, body) => {
  const questionRules = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    telephone: [Joi.string(), Joi.number()],
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required()
  });

  const result = Joi.validate(body, questionRules);
  if (result.error) {
    return res.status(400).json(result.error.details[0].message);
  }
  return body;
};

module.exports = validateUserBody;
