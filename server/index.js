// console.log("Hello World");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//DB connect
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/LIO_AUTH");

//Schema for users table
const Users = mongoose.model("Users", {
  username: String,
  email: String,
  password: String,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const email = req.body.emailAddress;
  const password = req.body.password;
  // console.log(req.body);

  // Hash the password using bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new Users({
    username: username,
    email: email,
    password: hashedPassword,
  });
  // const user = new Users({username: 'shonitmullebaaz786', email: 'ronitreza69@hotmail.com', password: 'baranwal++'});

  await user
    .save()
    .then(() => {
      res.send({ message: "User saved successfully." });
    })
    .catch(() => {
      res.send({ message: "Server error." });
    });
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    // console.log(req.body);
    // const user = new Users({username: username, email: email, password: password});
    // const user = new Users({username: 'shonitmullebaaz786', email: 'ronitreza69@hotmail.com', password: 'baranwal++'});
    // Find the user by username
    const user = await Users.findOne({ username });

    if (!user) {
      return res.send({ message: "User not found!" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.send({ message: "Password entered incorrectly." });
    }

    const token = jwt.sign({ data: user }, "SPAN", { expiresIn: "1h" });
    res.send({ message: "User found successfully.", token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error." });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
