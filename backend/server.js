const { createServer } = require("http");

const hostname = "127.0.0.1";
const port = 8000;

const server = createServer((req, res) => {
  const route = req.url;

  switch (route) {
    case "/":
      res.end("Hello World");
      break;
    default:
      res.end("404 Not Found");
      break;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
