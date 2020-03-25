const express = require("express");
const mongoose = require("mongoose");
const productsRouter = require("./products/products.router");
const usersRouter = require("./users/users.router");
const ordersRouter = require("./orders/orders.router");


class ProductsServer {
  constructor(config) {
    this.server = null;
    this.routes = null;
    this.port = config.port;
    this.mongodb_url = config.mongodb_url;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDb();
    this.startListening();
  }

  initRoutes() {
    this.server.use("/products", productsRouter);
    this.server.use("/users", usersRouter);
    this.server.use("/orders", ordersRouter);
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
    this.server.use(express.urlencoded({ extended: true }));
  }

  async initDb() {
    await mongoose.set("useNewUrlParser", true);
    await mongoose.set("useFindAndModify", false);
    await mongoose.set("useCreateIndex", true);
    await mongoose.set("useUnifiedTopology", true);
    await mongoose.connect(this.mongodb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false
    });
  }

  startListening() {
    this.server.listen(this.port, () => {
      console.log("Server started listening on port", this.port);
    });
  }
}

module.exports = ProductsServer;
