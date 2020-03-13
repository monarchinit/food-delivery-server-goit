const controller = require("../controller");
const express = require("express");
const userRouter = express.Router();

userRouter.post("/", controller.createUser);
userRouter.get("/", controller.getUsers);

module.exports = userRouter;