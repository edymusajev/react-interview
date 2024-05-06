import { useEffect, useState } from "react";
import Details from "./components/Detail";
import Projects from "./components/ProjectNew";
import {Project} from './types/type'

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>();
  const [currentProject, setCurrentProject] = useState({});
  const [loading, setLoading] = useState(false)

  const fetchProjects = async () => {
    const data = await fetch("http://127.0.0.1:8000/projects");
    const res = await data.json();

    setProjects(res);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getEachProjectById = async () => {
    console.log("currentId", currentProjectId);
    try {
      if (currentProjectId) {
        const data = await fetch(
          `http://127.0.0.1:8000/projects/${currentProjectId}`
        );
        const res = await data.json();
        setCurrentProject(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEachProjectById();
  }, [currentProjectId]);

  const updateTask = async (projectId: string, taskId: string, name: string, status: string, des: string) => {
    try {
      const url = `http://127.0.0.1:8000/projects/${projectId}/tasks/${taskId}`;
      const data = {
        title: name,
        status,
        description: des,
      };
  
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const updatedTask = await response.json();
      console.log("Updated task:", updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const createNewProject = async (name: string) => {
    setLoading(true)
    try {
      const data = {
      projectName: name,
    };
    const response = await fetch("http://127.0.0.1:8000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(data)

      })

      if (response.ok) {
        const newProject = await response.json(); // Assuming the response includes the new project data
        await fetchProjects(); // Refresh the projects list
        setCurrentProjectId(newProject.projectId); // Set the current project ID using the new project data
      }
      console.log(response)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
    
    }

    const deleteProject = async (projectId: string | undefined) => {
      const response = await fetch(`http://127.0.0.1:8000/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "text/plain",
        }
       
      });
    
      if (response.ok) {
        await fetchProjects(); // Refresh the projects list to reflect the deletion
        // Optional: Reset currentProjectId if the deleted project was the one being viewed
        if (currentProjectId === projectId) {
          setCurrentProjectId(undefined); // Or set to another project ID as appropriate
          setCurrentProject({}); // Clear the current project details from state
        }
      } else {
        console.error("Failed to delete the project");
      }
    }

    const updateName = async (id: string,projectNam:string,  projectDes: string, ) => {
      console.log(id, "des", projectDes, "name:" ,projectNam);
      const url = `http://127.0.0.1:8000/projects/${id}`;
      const data = { projectName: projectNam, projectDescription: projectDes };
    
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        await fetchProjects();
    
        const responseData = await response.json();
        console.log("Response data:", responseData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

  if (projects.length === 0) return <div>Loadingg...</div>;

  return (
    <div>
      <div className="h-10 border-b flex items-center px-2">
        <span className="text-muted text-sm font-bold ">PROJECT MANAGER</span>
      </div>
      <div className="grid grid-cols-12  divide-x h-[calc(100vh-40px)]">
        <div className="col-span-3">
          {Array.isArray(projects) && projects.length > 0 && (
            <Projects
            createNewProject={createNewProject}
              currentProjectId={currentProjectId!}
              setCurrentProjectId={setCurrentProjectId}
              projects={projects}
            />
          )}
        </div>
        <div className="col-span-9">
          {loading ? <p>loading...</p> : currentProjectId ? (
            <p>
              {Object.keys(currentProject).length > 0 && (
                <Details detail={currentProject} updateTask={updateTask} deleteProject={deleteProject} updateName={updateName} />
              )}
            </p>
          ) : (
            
            <p className="p-2 font-medium text-lg"> No Project Selected</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
