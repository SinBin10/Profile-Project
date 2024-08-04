const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const path = require("path");
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  // a cookie helps to identify a user without providing username and password everytime they perform an operation.
  //a cookie is a random string which is sent by the server to the client and it travels with client as he changes routes.  //using bcrypt to generate salt and hash a password this encrypted password is stored in the database
  //when the user tries to login again the .compare function is used to check if the hashed password of the user matched the one stored within the database
  //this .compare returns a true or false
  //sha(secure hash algorithm) is 256 bit hashing algorithm which is very secure
  // bcrypt.genSalt(10, function (err, salt) {
  //   bcrypt.hash("hubble", salt, function (err, hash) {});
  // });
  // bcrypt.compare(
  //   "hubbe",
  //   "$2b$10$ueIlGu22M84pTYh7B4TJqOP.PvydKdlUdCerKLIpcBDxSiOyg5PsC",
  //   function (err, result) {
  //     console.log(result);
  //   }
  // );
  //JsonWebToken --> used to encrypt user data(generally email) and send that as the cookie to the server which server decrypts and identifies the user.
  const token = jwt.sign({ email: "hubble@gmail.com" }, "secret");
  res.cookie("token", token);
  res.render("index");
});

app.post("/create", async (req, res) => {
  const { name, email, image } = req.body;
  await userModel.create({
    name: name,
    email: email,
    image: image,
  });
  res.redirect("/");
});

app.get("/read", async (req, res) => {
  console.log(req.cookies.token);
  let data = jwt.verify(req.cookies.token, "secret");
  console.log(data);
  let allUsers = await userModel.find();
  res.render("read", { allUsers });
});

app.get("/delete/:id", async (req, res) => {
  await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});

app.get("/edit/:id", async (req, res) => {
  let user = await userModel.findOne({ _id: req.params.id });
  res.render("update", { user });
});

app.post("/update/:id", async (req, res) => {
  const { name, email, image } = req.body;
  await userModel.findOneAndUpdate(
    { _id: req.params.id },
    { name, email, image },
    { new: true }
  );
  res.redirect("/read");
});

app.listen(3000);
