const questionController = require("./controller");

 const productsRouter = [
  {
    method: "GET",
    url: "/products",
    handler: questionController.getProducts
  },
  {
    method: 'POST',
    url: '/signup',
    handler: questionController.createUser
  }
];

module.exports = productsRouter
