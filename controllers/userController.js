const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
  // updateUser: function(data){

  // }
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const rolesList = require("../config/roles_list");

const getAllUsers = (req, res) => {
  if (usersDB.users.length === 0)
    return res
      .status(200)
      .json({ message: "User db is empty", users: usersDB.users });
  const sortedUsers = usersDB.users.map((user) => ({
    id: user.id,
    username: user.username,
    roles: user.roles,
  }));
  res.status(200).json({ message: "success", users: sortedUsers });
};

const createUser = async (req, res) => {
  const { username, password, roles } = req.body;
  console.log(`${username}, ${password}, ${roles}`);
  if (!username || !password || !roles)
    return res
      .status(400)
      .json({ message: "Username, password and roles are required" });
  const duplicate = usersDB.users.find(
    (person) => person.username === username
  );
  if (duplicate)
    return res.status(409).json({ message: `${username} already exists` });
  console.log(`is array = ${Array.isArray(roles)}`);
  if (!Array.isArray(roles))
    return res
      .status(406)
      .json({ message: "roles must be assigned as list or array inside [ ]" });
  const assignedRoles = roles.some((role) => !rolesList.includes(role));
  if (assignedRoles) {
    const notInRolesList = roles.filter((role) => !rolesList.includes(role));
    return res
      .status(406)
      .json({ message: `[ ${notInRolesList} ] is not in rolesList` });
  }
  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = {
      id: usersDB.users.length + 1,
      username: username,
      password: hashedPwd,
      roles: roles,
    };
    // usersDB.setUsers([...usersDB.users, newUser]);
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // );
    console.log(usersDB.users);
    res.status(201).json({
      message: `user ${username} updated successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const username = req.body.username;
  const foundUserId = usersDB.users.find((person) => person.id === id);
  if (!foundUserId)
    return res.status(400).json([{ message: `user with id ${id} not found` }]);
  if (!username) res.status(404).json([{ message: "username is required" }]);
  try {
    foundUserId.username = username;
    const updatedUser = {
      id: foundUserId.id,
      username: foundUserId.username,
      password: foundUserId.password,
      roles: foundUserId.roles,
    };
    usersDB.setUsers([...usersDB.users, updatedUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res
      .status(201)
      .json([{ message: "updated successfully", user: updatedUser }]);
    // res.status(200).json([{ message: "success", user: foundUser }]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAnUser = (req, res) => {
  const id = parseInt(req.params.id);
  const foundUser = usersDB.users.find((person) => person.id === id);
  if (!foundUser) return res.status(200).json({ message: "no such user" });
  res.status(200).json({
    message: "success",
    user: {
      id: foundUser.id,
      username: foundUser.username,
      roles: foundUser.roles,
    },
  });
};

module.exports = { getAllUsers, createUser, updateUser, getAnUser };
