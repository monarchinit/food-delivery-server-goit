require = require("esm")(module);
const ProductsServer = require("./src/server");
const config = require("./config");

new ProductsServer(config).start();
