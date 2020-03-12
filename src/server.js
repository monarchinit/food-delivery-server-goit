const http = require("http");
const routes = require("./routes/routes");

class ProductsServer {
  constructor(port) {
    this.routes = null;
    this.port = port;
  }

  start() {
    this.initRoutes();
    this.initServer();
    this.startListening();
  }

  initRoutes() {
    this.routes = [...routes];
  }

  initServer() {
    this.server = http.createServer(this.serverCallback.bind(this));
  }

  async serverCallback(req, res) {
    const { method, url } = req;
    const handled = this.routes.some(route => {
      if (route.method === method && route.url === url) {
        try {
          route.handler(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.end();
        }
        return true;
      }
   

      return false;
    });

    if (!handled) {
      res.statusCode = 404;
      res.end();
    }
  }

  startListening() {
    this.server.listen(this.port, () => {
      console.log("Server started listening on port", this.port);
    });
  }
}

module.exports = ProductsServer;
