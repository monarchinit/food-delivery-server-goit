const http = require("http");
const URL = require("url");
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
    this.routes = routes;
  }

  initServer() {
    this.server = http.createServer(this.serverCallback.bind(this));
  }

  async serverCallback(req, res) {
    const { method, url } = req;
    const pathname = URL.parse(url).pathname;
    const handled = this.routes(req, res).some(route => {
      if (route.method === method && route.url === pathname) {
        try {
          route.handler(req, res, route.id);
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
