const path = require("path");
// const { promises } = require("fs");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Model {
  constructor() {
    this.usersFilePath = path.join(__dirname, `../../db/users/username.json`);
  }
  async create(body, id, usersFilePath) {
    const file = fs.readFile(usersFilePath, (err, data) => {
      let users = JSON.parse(data);
      users = [{ id, ...body }, ...users];
      // console.log(users);
      fs.writeFile(usersFilePath, JSON.stringify(users), function(err) {
        if (err) {
          throw err;
        }
      });
    });
  }

  async createUserImage(usersFilePath, fileUrl, id) {
    const data = await readFile(usersFilePath);
    let users = JSON.parse(data);
    try {
      users = users.map(e => (e.id === id ? e.images.push(fileUrl) && e : e));
      await writeFile(usersFilePath, JSON.stringify(users));
    } catch (e) {
      throw new Error(e);
    }
    console.log(id)
    console.log(users.find(e => e.id === id))
    return users.find(e => e.id === id);
  }
}

module.exports = new Model();
