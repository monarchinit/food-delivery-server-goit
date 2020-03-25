const controller = require("./orders.controller");
const express = require("express");
const ordersRouter = express.Router();

ordersRouter.get("/", controller.getOrders);
ordersRouter.get("/:orderId", controller.getOrderWithId);
ordersRouter.post(
  "/",
  controller.validateOrderBody,
  controller.createOrder
);


module.exports = ordersRouter;
