const controller = require("./users.controller");
const express = require("express");
const usersRouter = express.Router();

usersRouter.get("/", controller.getUsers);
usersRouter.get("/:userId", controller.getUserWithId);
usersRouter.put("/:userId", controller.updateUserWithId);
usersRouter.post(
  "/",
  controller.aggregateBodyForCreateUserWithImage,
  controller.validateUserBody,
  controller.createUser
);


module.exports = usersRouter;
