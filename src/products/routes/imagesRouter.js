const controller = require("../controller");
const express = require("express");
const imagesRouter = express.Router();
const validateCreateImage = require("../halpers/validateCreateImage");
const aggregateBodyForCreateImageUser = require("../halpers/aggregateBodyForCreateImageUser");

imagesRouter.post(
  "/",
  aggregateBodyForCreateImageUser,
  validateCreateImage,
  controller.createImageUser
);

module.exports = imagesRouter;
