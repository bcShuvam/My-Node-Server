const express = require("express");
const router = express.Router();
const rolesList = require("../config/roles_list");

router.route("/").get((req, res) => {
  res.status(200).json([{ message: "success", rolesList: rolesList }]);
});

module.exports = router;
