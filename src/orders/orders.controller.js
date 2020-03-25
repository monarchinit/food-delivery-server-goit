const Joi = require("@hapi/joi");
import ordersModel from "./orders.model";
import usersModel from "../users/users.model";

class OrdersController {
  async getOrders(request, response, next) {
    try {
      const dataRes = await ordersModel.getOrders();
      return response.status(200).json({
        status: dataRes.length === 0 ? "no orders" : "succes",
        orders: dataRes
      });
    } catch (err) {
      next(err);
    }
  }

  async createOrder(request, response, next) {
    try {
      const body = request.body;
      const dataRes = await ordersModel.createOrder(body);
      usersModel.upadeUserOrdersArray(dataRes);
      return response.status(201).json({
        status: "succes",
        order: dataRes
      });
    } catch (err) {
      next(err);
    }
  }

  async getOrderWithId(request, response, next) {
    try {
      const { orderId } = request.params;
      const user = await ordersModel.getOrderById(orderId);
      return response.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  validateOrderBody(request, response, next) {
    const schema = Joi.object({
      creator: Joi.string().required(),
      productsList: Joi.array().items(
        Joi.object({
          product: Joi.string().required(),
          type: Joi.string().required(),
          itemsCount: Joi.number().required().max(10)
        })
      ),

      deliveryType: Joi.string().required(),
      deliveryAdress: Joi.string().required(),
      sumToPay: Joi.number().required(),
      status: Joi.string()
    });

    const result = schema.validate(request.body);
    if (result.error) {
      const err = new Error(result.error.details[0].message);
      err.status = 400;

      return next(err);
    }
    next();
  }
}

const ordersController = new OrdersController();
module.exports = ordersController;