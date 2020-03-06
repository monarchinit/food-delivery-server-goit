const Joi = require("joi");

const validateCreateQuestionBody = async (req, res, bodyString) => {
  const body = JSON.parse(bodyString);

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
    const err = result.error.details[0].message;
    res.writeHead(400, { "Content-Type": "aplication/json" });
    return res.end(JSON.stringify(err))
  }

  return body;
};

module.exports = validateCreateQuestionBody;
