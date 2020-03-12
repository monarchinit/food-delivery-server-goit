const fs = require("fs");
const path = require("path");
const url = require("url");
const querystring = require("querystring");
const aggregateRequestBody = require("./halpers/aggregateRequestBody");
const validateCreateQuestionBody = require("./halpers/validateCreateQuestionBody");
const Model = require("./halpers/model");

class ProductsController {
  constructor() {
    this.filePathProducts = path.join(
      __dirname,
      "../",
      "db/products/",
      "products.json"
    );
  }

  get getProducts() {
    return this._getProducts.bind(this);
  }

  get getProductsWithId() {
    return this._getProductsWithId.bind(this);
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
      response.writeHead(200, { "Content-Type": "aplication/json" });
      response.write(
        JSON.stringify({
          status: dataRes.length === 0 ? "no products" : "succes",
          products: dataRes
        })
      );
      response.end();
    });
  }

  _getProductsWithId(request, response, id) {
    fs.readFile(this.filePathProducts, function(err, data) {
      const dateRes = {
        status: "succes",
        products: JSON.parse(data).find(e => e.id == id)
      };
      if (!dateRes.products) {
        response.statusCode = 404;
        return response.end();
      }
      response.writeHead(200, { "Content-Type": "aplication/json" });
      response.write(JSON.stringify(dateRes));
      response.end();
    });
  }

  async createUser(request, response) {
    const bodyString = await aggregateRequestBody(request);
    let body;
    try {
      body = await validateCreateQuestionBody(request, response, bodyString);
    } catch (err) {
      response.statusCode = 400;
      return response.end(JSON.stringify(err));
    }
    await Model.createUser(body);
    response.writeHead(201, { "Content-Type": "aplication/json" });
    response.write(
      JSON.stringify({
        status: "success",
        user: body
      })
    );
    response.end();
  }
}

const productsController = new ProductsController();
module.exports = productsController;
