const fs = require("fs");
const path = require("path");
const url = require("url");
const querystring = require("querystring");
const validateCreateUserBody = require("./halpers/validateCreateUserBody");
const Model = require("./halpers/model");

class ProductsController {
  constructor() {
    this.filePathProducts = path.join(
      __dirname,
      "../",
      "db/products/",
      "products.json"
    );
    this.filePathUsers = path.join(
      __dirname,
      "../",
      "db/users",
      "username.json"
    );
    this.filePathOrders = path.join(
      __dirname,
      "../",
      "db/users/orders",
      "orders.json"
    );
  }

  get getProducts() {
    return this._getProducts.bind(this);
  }

  get getProductsWithId() {
    return this._getProductsWithId.bind(this);
  }

  get getUsers() {
    return this._getUsers.bind(this);
  }
  get getUsersWithId() {
    return this._getUsersWithId.bind(this);
  }
  get createOrder() {
    return this._createOrder.bind(this);
  }
  get createUser() {
    return this._createUser.bind(this);
  }

  get createImageUser() {
    return this._createImageUser.bind(this);
  }

  _getProducts(request, response) {
    const parsedUrl = url.parse(request.url);
    const querystringObj = querystring.parse(parsedUrl.query);

    fs.readFile(this.filePathProducts, function(err, data) {
      let dataRes = JSON.parse(data);
      if ("category" in querystringObj) {
        dataRes = dataRes.reduce((acc, e) => {
          if (e.categories.includes(querystringObj.category)) {
            acc.push({
              id: e.id,
              sku: e.sku,
              name: e.name,
              description: e.description
            });
          }
          return acc;
        }, []);
      }
      if ("ids" in querystringObj) {
        const ids = querystringObj.ids.split(",");
        dataRes = ids.reduce((acc, e) => {
          const res = dataRes.find(elem => elem.id == e);
          res &&
            acc.push({
              id: res.id,
              sku: res.sku,
              name: res.name,
              description: res.description
            });
          return acc;
        }, []);
      }
      return response.status(200).json({
        status: dataRes.length === 0 ? "no products" : "succes",
        products: dataRes
      });
    });
  }

  _getProductsWithId(request, response) {
    const id = request.baseUrl.slice(request.baseUrl.lastIndexOf("/") + 1);
    fs.readFile(this.filePathProducts, function(err, data) {
      const dateRes = {
        status: "succes",
        products: JSON.parse(data).find(e => e.id == id)
      };
      if (!dateRes.products) {
        return response.status(404).json({
          status: "no products",
          products: []
        });
      }
      response.status(200).json(dateRes);
    });
  }

  async _createUser(request, response) {
    let body;
    const id = `${Date.now()}`;
    try {
      body = await validateCreateUserBody(request, response, request.body);
    } catch (err) {
      return response.status(400).json(err);
    }
    body.images = [];
    await Model.create(body, id, this.filePathUsers);
    response.status(201).json({
      status: "success",
      user: { id, ...body }
    });
  }

  async _createImageUser(request, response, next) {
    try {
      const body = request.body;
      const filePath = body.file.path;
      const fileStats = path.parse(filePath);
      const fileUrl = "http://localhost:3001/" + fileStats.base;
      let obj;
      try {
        obj = await Model.createUserImage(
          this.filePathUsers,
          fileUrl,
          body.userId
        );
        console.log(obj)
      } catch (e) {
        throw new Error(e);
      }
      console.log(obj);

      return response
        .status(201)
        .send({ status: `was saved : ${fileUrl}`, user: obj });
    } catch (err) {
      next(err);
    }
  }

  _getUsers(request, response) {
    fs.readFile(this.filePathUsers, function(err, data) {
      let dataRes = JSON.parse(data);
      return response.status(200).json({
        status: dataRes.length === 0 ? "no users" : "succes",
        users: dataRes
      });
    });
  }

  _getUsersWithId(request, response) {
    const id = request.baseUrl.slice(request.baseUrl.lastIndexOf("/") + 1);
    fs.readFile(this.filePathUsers, function(err, data) {
      const dateRes = {
        status: "succes",
        users: JSON.parse(data).find(e => e.id == id)
      };
      console.log(dateRes);
      if (!dateRes.users) {
        return response.status(404).json({
          status: "not found",
          users: []
        });
      }
      response.status(200).json(dateRes);
    });
  }

  async _createOrder(request, response) {
    const id = `${Date.now()}`;
    const productsId = request.body.products;
    let dataRes;
    fs.readFile(this.filePathProducts, async function(err, data) {
      dataRes = JSON.parse(data);
      dataRes = productsId.reduce((acc, e) => {
        const res = dataRes.find(elem => elem.id == e);
        res && acc.push(res);
        return acc;
      }, []);

      if (dataRes.length !== productsId.length) {
        return response.status(404).json({ status: "failed", order: null });
      }
      if (dataRes.length === productsId.length) {
        await Model.create(
          request.body,
          id,
          path.join(__dirname, "../", "db/users/orders", "orders.json")
        );
        response.status(201).json({
          status: "success",
          order: { id, ...request.body }
        });
      }
    });
  }
}

const productsController = new ProductsController();
module.exports = productsController;


