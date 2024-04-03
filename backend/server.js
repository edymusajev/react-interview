const { createServer } = require("http");
const fs = require("node:fs/promises");

const hostname = "127.0.0.1";
const port = 8000;

const server = createServer(async (req, res) => {
  let route = req.url;

  // Helper function to send JSON response
  const sendJSON = (data, statusCode = 200) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };

  // Pre-process the route for dynamic URL matching
  let dynamicProjectId;
  let dynamicTaskId;
  const projectRoutePattern = /^\/projects\/([a-zA-Z0-9\-_]+)$/;
  const projectTasksRoutePattern = /^\/projects\/([a-zA-Z0-9\-_]+)\/tasks$/;
  const projectTaskDetailPattern =
    /^\/projects\/([a-zA-Z0-9\-_]+)\/tasks\/([a-zA-Z0-9\-_]+)$/;

  if (projectRoutePattern.test(route)) {
    dynamicProjectId = route.match(projectRoutePattern)[1];
    route = "/projects/:id";
  } else if (projectTasksRoutePattern.test(route)) {
    dynamicProjectId = route.match(projectTasksRoutePattern)[1];
    route = "/projects/:projectId/tasks";
  } else if (projectTaskDetailPattern.test(route)) {
    const matches = route.match(projectTaskDetailPattern);
    dynamicProjectId = matches[1];
    dynamicTaskId = matches[2];
    route = "/projects/:projectId/tasks/:taskId";
  }

  const jsonFile = await fs.readFile("projects.json", "utf-8");
  const projects = JSON.parse(jsonFile);
  const method = req.method;

  switch (route) {
    case "/":
      res.end("Project Management API");
      break;
    case "/projects":
      // Handle GET and POST for projects
      if (method === "GET") {
        sendJSON(projects);
      } else if (method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const payload = JSON.parse(body);
          if (!payload.projectName) {
            sendJSON({ error: "Project is missing required fields" }, 400);
            return;
          }

          const newProject = {
            projectId: crypto.randomUUID(),
            projectName: payload.projectName,
            tasks: [],
          };

          projects.push(newProject);
          await fs.writeFile("projects.json", JSON.stringify(projects));
          sendJSON({ projectId: newProject.projectId });
        });
      } else {
        sendJSON({ error: "Method not allowed" }, 405);
      }
      break;
    case "/projects/:id":
      // Extract projectId from URL
      const projectId = req.url.split("/")[2];
      const project = projects.find((p) => p.projectId === projectId);

      if (!project) {
        sendJSON({ error: "Project not found" }, 404);
        return;
      }

      if (method === "GET") {
        sendJSON(project);
      } else if (method === "PUT") {
        // Handle project update
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const payload = JSON.parse(body);
          if (payload.projectName) {
            project.projectName = payload.projectName;
          }
          await fs.writeFile("projects.json", JSON.stringify(projects));
          sendJSON(project);
        });
      } else if (method === "DELETE") {
        // Handle project deletion
        const index = projects.indexOf(project);
        projects.splice(index, 1);
        await fs.writeFile("projects.json", JSON.stringify(projects));
        sendJSON({ message: "Project deleted" });
      } else {
        sendJSON({ error: "Method not allowed" }, 405);
      }
      break;
    case "/projects/:projectId/tasks":
      const projectIdTasks = req.url.split("/")[2];
      const projectIndex = projects.findIndex(
        (p) => p.projectId === projectIdTasks
      );

      if (projectIndex === -1) {
        sendJSON({ error: "Project not found" }, 404);
        return;
      }

      if (method === "GET") {
        sendJSON(projects[projectIndex].tasks);
      } else if (method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const payload = JSON.parse(body);
          const newTask = {
            taskId: crypto.randomUUID(),
            title: payload.title,
            description: payload.description,
            status: payload.status,
            assignees: payload.assignees,
            dueDate: payload.dueDate,
            comments: [],
            subTasks: [],
          };

          projects[projectIndex].tasks.push(newTask);
          await fs.writeFile("projects.json", JSON.stringify(projects));
          sendJSON(newTask);
        });
      } else {
        sendJSON({ error: "Method not allowed" }, 405);
      }
      break;

    case "/projects/:projectId/tasks/:taskId":
      const urlParts = req.url.split("/");
      const projectIdForTask = urlParts[2];
      const taskId = urlParts[4];
      const projectForTask = projects.find(
        (p) => p.projectId === projectIdForTask
      );

      if (!projectForTask) {
        sendJSON({ error: "Project not found" }, 404);
        return;
      }

      const taskIndex = projectForTask.tasks.findIndex(
        (t) => t.taskId === taskId
      );
      if (taskIndex === -1) {
        sendJSON({ error: "Task not found" }, 404);
        return;
      }

      if (method === "GET") {
        sendJSON(projectForTask.tasks[taskIndex]);
      } else if (method === "PUT") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const payload = JSON.parse(body);
          const task = projectForTask.tasks[taskIndex];
          Object.assign(task, payload); // Update task with payload
          await fs.writeFile("projects.json", JSON.stringify(projects));
          sendJSON(task);
        });
      } else if (method === "DELETE") {
        projectForTask.tasks.splice(taskIndex, 1);
        await fs.writeFile("projects.json", JSON.stringify(projects));
        sendJSON({ message: "Task deleted" });
      } else {
        sendJSON({ error: "Method not allowed" }, 405);
      }
      break;

    default:
      sendJSON({ error: "Not Found" }, 404);
      break;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
