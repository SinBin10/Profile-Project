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
  console.log(req.body);
  const { name, email, image } = req.body;
  await userModel.create({
    name: name,
    email: email,
    image: image,
  });
  res.redirect("/");
});

app.listen(3000);
