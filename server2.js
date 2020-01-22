require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const cars = [
  {
    username: "macron",
    car: "peugeot"
  },
  {
    username: "merkel",
    car: "toyota"
  },
  {
    username: "sanchez",
    car: "seat"
  }
];

app.get("/cars", authenticateToken, (req, res) => {
  res.json(cars.filter(car => car.username === req.user.name));
});

app.post("/login", express.urlencoded({ extended: true }), (req, res) => {
  // Authentification

  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.SECRET);
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(4000);
