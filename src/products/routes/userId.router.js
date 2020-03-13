const controller = require("../controller");
const express = require("express");
const UserIdRouter = express.Router();

UserIdRouter.get("/", controller.getUsersWithId);


module.exports = UserIdRouter;