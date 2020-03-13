const controller = require("../controller");
const express = require("express");
const ordersRouter = express.Router();
const validateCreateOrder = require("../halpers/validateCreateOrder");

ordersRouter.post("/", validateCreateOrder, controller.createOrder);

module.exports = ordersRouter;
