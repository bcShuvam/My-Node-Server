const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .put(userController.updateUser);

router.route("/:id").get(userController.getAnUser);

module.exports = router;
