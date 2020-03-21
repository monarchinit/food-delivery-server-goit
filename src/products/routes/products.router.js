// const controller = require("./controller");
// const url = require("url");

// const productsRouter = (req, res) => {
//   const parsedUrl = url.parse(req.url)
//   const id = parsedUrl.pathname.slice(parsedUrl.pathname.lastIndexOf("/") + 1);
//   return [
//     {
//       method: "GET",
//       url: "/products",
//       handler: controller.getProducts
//     },
//     {
//       method: "GET",
//       url: "/products" + "/" + id,
//       handler: controller.getProductsWithId,
//       id:id
//     },
//     {
//       method: "POST",
//       url: "/signup",
//       handler: controller.createUser
//     }
//   ];
// };

// module.exports = productsRouter;

const controller = require("../controller");
const express = require("express");
const productsRouter = express.Router();

productsRouter.get("/", controller.getProducts);

module.exports = productsRouter;
