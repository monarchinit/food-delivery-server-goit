const controller = require("../controller");
const express = require("express");
const productsIdRouter = express.Router();

productsIdRouter.get("/", controller.getProductsWithId);


module.exports = productsIdRouter;