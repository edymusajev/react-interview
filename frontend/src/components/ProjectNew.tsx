import React, { useState } from "react";


import {Project} from '../types/type'
interface DetailsProps {
    projects: Project[];
    setCurrentProjectId: (id: string) => void;
    currentProjectId : string;
    createNewProject: (projectName: string) => Promise<void>;
  }

const Projects = ({ projects, setCurrentProjectId, currentProjectId ,createNewProject}: DetailsProps) => {
const [projectName, setProjectName] = useState("")

console.log()
  return (
    <div className="p-2 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-y-2 w-full">
        {projects.map((p) => (
            
           <button key={p.projectId} onClick={() =>setCurrentProjectId(p.projectId)}  className={`border rounded-md ${currentProjectId === p.projectId ? "bg-black text-white" : null} active:bg-black active:text-white hover:text-white hover:bg-black border-1 solid border-gray-400 p-2 w-full `}>{
           p.projectName
        }</button>
        ))}
      </div>
      <div className="flex gap-2 flex-col">
      
       <input onChange={(e) => setProjectName(e.target.value)} className="p-2 border border--1 border-gray-400 rounded-md" placeholder="Enter New Task Name"></input>{}
      
      <button onClick={() => createNewProject(projectName)} className="w-full p-2 bg-black rounded-md text-white ">Add Task</button>
    </div></div>
  );
};

export default Projects;
