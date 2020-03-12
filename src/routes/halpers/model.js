const path = require("path");
// const { promises } = require("fs");
const fs = require("fs");

class Model {
  constructor() {
    this.usersFilePath = path.join(__dirname, `../../db/users/username.json`);
  }
  async createUser(body) {
    const file = fs.readFile(this.usersFilePath, (err, data) => {
      let users = JSON.parse(data);
      users = [...users, body];
      fs.writeFile(this.usersFilePath, JSON.stringify(users), function(err) {
        if (err) {
          throw err;
        }
      });
    });
  }
}

module.exports = new Model();
