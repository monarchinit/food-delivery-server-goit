const http = require("http");
const URL = require("url");
const express = require("express");
const productsRouter = require("./products/routes/products.router");
const productsIdRouter = require("./products/routes/productsId.router");
const userRouter = require("./products/routes/user.router");
const userIdRouter = require("./products/routes/userId.router");
const ordersRouter = require("./products/routes/orders.router");
const imagesRouter = require("./products/routes/imagesRouter")

class ProductsServer {
  constructor(port) {
    this.server = null;
    this.routes = null;
    this.port = port;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initRoutes() {
    this.server.use("/products", productsRouter);
    this.server.use("/products/:productsId", productsIdRouter);
    this.server.use("/users", userRouter);
    this.server.use("/users/:usersId", userIdRouter);
    this.server.use("/orders", ordersRouter);
    this.server.use("/images", imagesRouter);
    this.server.use((err, req, res, next) => {
      delete err.stack;
      next(err);
    });
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(express.static("static"));
  }

  startListening() {
    this.server.listen(this.port, () => {
      console.log("Server started listening on port", this.port);
    });
  }
}

module.exports = ProductsServer;
