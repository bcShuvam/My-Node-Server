const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config;

const handleLogin = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json([{ message: "Username and password are required" }]);
  const foundUser = usersDB.users.find((user) => user.username === username);
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // create jwt's
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
          username: foundUser.username,
          roles: Object.values(foundUser.roles),
        },
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "30s" }
    );
    res
      .status(200)
      .json([{ message: "Login successful", accessToken: accessToken }]);
  } else {
    res.status(400).json([{ message: "Incorrect password" }]); // Unauthorized
  }
};

module.exports = handleLogin;
