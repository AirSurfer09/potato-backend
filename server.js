import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.get("/api/jokes", (req, res) => {
  const jokes = [
    { id: 1, content: "This is a joke" },
    { id: 2, content: "This is second joke" },
    { id: 3, content: "This is third joke" },
    { id: 4, content: "This is forth joke" },
  ];
  res.send(jokes);
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving at http://localhost:${port}`);
});
