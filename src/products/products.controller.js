const path = require("path");
const Joi = require("joi");
import productsModel from "./products.model";
import formidable from "formidable";

class UsersController {
  async getProducts(request, response, next) {
    try {
      const dataRes = await productsModel.getProducts(request.query);
      return response.status(200).json({
        status: [...dataRes].length === 0 ? "no products" : "succes",
        products: dataRes
      });
    } catch (err) {
      next(err);
    }
  }

  async createProduct(request, response, next) {
    try {
      let dataRes;
      const body = request.body;
      if (typeof body.categories === "string") {
        body.categories = body.categories.split(", ");
      }
      if (body.image) {
        const filePath = body.image.path;
        const fileStats = path.parse(filePath);
        body.image = ["http://localhost:3001/" + fileStats.base];
        dataRes = await productsModel.createProduct(body);
      }
      dataRes = await productsModel.createProduct(body);
      return response.status(201).json({
        status: "succes",
        product: dataRes
      });
    } catch (err) {
      next(err);
    }
  }

  async getProductWithId(request, response, next) {
    try {
      const { productId } = request.params;
      const product = await productsModel.getProductById(productId);
      return response.status(200).json({ status: "success", product: product });
    } catch (err) {
      next(err);
    }
  }

  async updateProductWithId(req, res, next) {
    try {
      if (!req.body) return res.sendStatus(400);
      const id = req.params.productId;
      const body = req.body;
      if (typeof body.categories === "string") {
        body.categories = body.categories.split(", ");
      }
      const product = await productsModel.updateProduct(id, body);
      return res.status(200).json({ status: "success", product: product });
    } catch (err) {
      next(err);
    }
  }

  validateProductBody(request, response, next) {
    const questionRules = Joi.object().keys({
      sku: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.string().required(),
      currency: Joi.string().required(),
      creatorId: Joi.string().required(),
      categories: [Joi.string(), Joi.array()],
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

  aggregateBodyForCreateProductWithImage(req, res, next) {
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
