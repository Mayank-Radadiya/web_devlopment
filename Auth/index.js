// Backend for Auth with my custom Token.....

import express from "express";

const app = express();

const users = [];

const generateToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const tokenLength = 32;
  let token = "";

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
};

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
  users.push({ username, password, token: null }); // Initialize token as null
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

  const token = generateToken();
  user.token = token; // Assign the token to the specific user object
  console.log(users);

  return res.status(200).json({
    message: "Logged In",
    token: token,
  });
});

app.get("/myinfo", (req, res) => {
  const { token } = req.headers;

  const user = users.find((user) => user.token === token);
  if (!user) {
    return res.status(404).json({
      message: "User not found or incorrect Token.",
    });
  }

  return res.status(200).json({
    user,
  });
});

app.listen(3000, () => console.log("Server is Running..."));
