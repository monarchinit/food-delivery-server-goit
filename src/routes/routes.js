const questionController = require("./controller");
const url = require("url");

const productsRouter = (req, res) => {
  const parsedUrl = url.parse(req.url)
  const id = parsedUrl.pathname.slice(parsedUrl.pathname.lastIndexOf("/") + 1);
  return [
    {
      method: "GET",
      url: "/products",
      handler: questionController.getProducts
    },
    {
      method: "GET",
      url: "/products" + "/" + id,
      handler: questionController.getProductsWithId,
      id:id
    },
    {
      method: "POST",
      url: "/signup",
      handler: questionController.createUser
    }
  ];
};

module.exports = productsRouter;
