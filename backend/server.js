const { createServer } = require("http");
const fs = require("node:fs/promises");

const hostname = "127.0.0.1";
const port = 8000;

const server = createServer(async (req, res) => {
  let route = req.url;

  // Pre-process the route for dynamic URL matching
  const dynamicProjectRouteRegex = /^\/projects\/[a-zA-Z0-9\-_]+$/;
  if (dynamicProjectRouteRegex.test(route)) {
    // Set route to a constant value representing this pattern
    route = "/projects/:id"; // A placeholder for dynamic project routes
  }
  switch (route) {
    case "/":
      res.end("Hello World");
      break;
    case "/projects":
      const jsonFile = await fs.readFile("projects.json", "utf-8");
      const method = req.method;

      switch (method) {
        case "GET":
          res.end(jsonFile);
          break;
        case "POST":
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            const payload = JSON.parse(body);
            //   payload should have projectName only
            if (!payload.projectName) {
              res.end("Project is missing required fields");
              return;
            }

            const newProject = {
              projectId: crypto.randomUUID(),
              projectName: payload.projectName,
              tasks: [],
            };

            const projects = JSON.parse(jsonFile);
            projects.push(newProject);
            await fs.writeFile("projects.json", JSON.stringify(projects));
            res.end(
              JSON.stringify({
                projectId: newProject.projectId,
              })
            );
          });
          break;
        default:
          res.end("Method not allowed");
          break;
      }

      break;
    case "/projects/:id":
      const projectId = req.url.split("/")[2];
      res.end(`Project details for dynamic ID ${projectId}`);
      break;
    default:
      res.end("404 Not Found");
      break;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
