const ProductsServer = require('./src/server');
const { port } = require('./config');

new ProductsServer(port).start()