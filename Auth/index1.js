// Backend for Auth with my custom Token.....

import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const JWT_TOKEN = "Token";

const users = [];

app.use(express.json());

// Sign-up Route
app.post("/sign-up", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required.",
    });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // TODO: Hash the password before storing
  users.push({ username, password }); // Initialize token as null
  res.status(201).json({
    message: "User Created",
  });

  console.log(users);
});

// Sign-in Route
app.post("/sign-in", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required.",
    });
  }

  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return res.status(404).json({
      message: "User not found or incorrect password.",
    });
  }

  const token = jwt.sign(
    {
      username,
    },
    JWT_TOKEN
  );
  console.log(users);

  return res.status(200).json({
    message: "Logged In",
    token: token,
  });
});

app.get("/myinfo", (req, res) => {
  const { token } = req.headers;

  const verify = jwt.verify(token, JWT_TOKEN);
  const user = verify.username

  const userInfo = users.find((user) => user.username === user);
  if (!userInfo) {
    return res.status(404).json({
      message: "User not found or incorrect Token.",
    });
  }

  return res.status(200).json({
    user,
  });
});

app.listen(3000, () => console.log("Server is Running..."));
