const controller = require("./products.controller");
const express = require("express");
const productsRouter = express.Router();

productsRouter.get("/", controller.getProducts);
productsRouter.get("/:productId", controller.getProductWithId);
productsRouter.put("/:productId", controller.updateProductWithId);
productsRouter.post(
  "/",
  controller.aggregateBodyForCreateProductWithImage,
  controller.validateProductBody,
  controller.createProduct
);


module.exports = productsRouter;
