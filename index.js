import express from "express";
import { createServer } from "node:http";

const app = express();

const server = createServer();

app.use(express.static("public"));

server.on("request", (req, res) => {
  app(req, res);
});

server.listen(8080);
