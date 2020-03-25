const path = require("path");
const Joi = require("joi");
import errors from "../halpers/errors.halper";
import usersModel from "./users.model";
import formidable from "formidable";

class UsersController {
  async createUser(request, response, next) {
    try {
      let dataRes;
      const body = request.body;
      if (body.image) {
        const filePath = body.image.path;
        const fileStats = path.parse(filePath);
        body.image = ["http://localhost:3001/" + fileStats.base];
        dataRes = await usersModel.createUser(body);
      }

      dataRes = await usersModel.createUser(body);
      return response.status(201).json({
        status: "succes",
        users: dataRes
      });
    } catch (err) {
      next(err);
    }
  }

  async getUsers(request, response, next) {
    try {
      const dataRes = await usersModel.getUsers();
      return response.status(200).json({
        status: dataRes.length === 0 ? "no users" : "succes",
        users: dataRes
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserWithId(request, response, next) {
    try {
      const { userId } = request.params;
      const user = await usersModel.getUserById(userId);
      return response.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async updateUserWithId(req, res, next) {
    try {
      if (!req.body) return res.sendStatus(400);
      const id = req.params.userId;
      const body = req.body;
      const user = await usersModel.updateUser(id, body);
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  validateUserBody(request, response, next) {
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
        .required(),
      image: Joi.object()
    });

    const result = Joi.validate(request.body, questionRules);
    if (result.error) {
      const err = new Error(result.error.details[0].message);
      err.status = 400;

      return next(err);
    }
    next();
  }

  aggregateBodyForCreateUserWithImage(req, res, next) {
    if (req.headers["content-type"] === "application/json") {
      return next();
    }
    const form = formidable({
      multiples: true,
      uploadDir: __dirname + "../../../static",
      keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      req.body = {
        ...fields,
        ...files
      };

      next();
    });
  }
}

const usersController = new UsersController();
module.exports = usersController;
