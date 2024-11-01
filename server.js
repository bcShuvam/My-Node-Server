const express = require("express");
const app = express();
const veriftJWT = require("./middleware/verifyJWT");
require("dotenv").config();
const PORT = process.env.PORT || 3500;

// built-in middleware to handle ulencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.use("/login", require("./routes/auth"));

app.use(veriftJWT);

app.use("/user", require("./routes/users"));
app.use("/roles", require("./routes/roles"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
