require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const user_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicGVwZSIsImlhdCI6MTY3MzQ1MjkzMn0.z8BapA_nzvijTCU_5a-iNPOKCn5DhPe9dM8VuTaeepo";
const url = "http://localhost:3000/request";
const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${user_token}`,
  },
};

const app = express();

app.use(bodyParser.json());

app.get("/login", (req, res) => {
  const token = jwt.sign(
    {
      name: "pepe",
    },
    process.env.PRIVATE_KEY
  );

  res.header("auth-token", token).json({
    data: { token },
  });
});

app.get("/request", (req, res) => {
  const auth_token = req.headers.authorization;
  if (!auth_token) {
    res.send(401, "Unauthorized request");
  }

  const accessToken = auth_token.split(" ")[1];
  jwt.verify(accessToken, process.env.PRIVATE_KEY, (err, payload) => {
    if (err) {
      res.send(401, "Unauthorized request");
    }
    res.json({ message: "Hello World!" });
  });
});

app.listen(3000);

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
