const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
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
  console.log(req.body);
  console.log(req.params);
  const { name, email, image } = req.body;
  await userModel.findOneAndUpdate(
    { _id: req.params.id },
    { name, email, image },
    { new: true }
  );
  res.redirect("/read");
});

app.listen(3000);
