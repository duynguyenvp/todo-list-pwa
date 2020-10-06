const jsonServer = require("json-server");
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "build", "db.json"));
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, "build"),
});

server.use(middlewares);
server.use(router);
server.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});
server.listen(3000, () => {
  console.log("JSON Server is running", 3000);
});
