const fs = require("fs");
const path = require("path");
const aggregateRequestBody = require("./halpers/aggregateRequestBody");
const validateCreateQuestionBody = require("./halpers/validateCreateQuestionBody");
const Model = require("./halpers/model");

class ProductsController {
  getProducts(request, response) {
    const filePathProducts = path.join(
      __dirname,
      "../",
      "db/products/",
      "products.json"
    );
    fs.readFile(filePathProducts, function(err, data) {
      response.writeHead(200, { "Content-Type": "aplication/json" });
      response.write(data);
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
