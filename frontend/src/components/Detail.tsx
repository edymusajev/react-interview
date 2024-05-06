import React, { useEffect, useState } from 'react'
import {Project} from '../types/type'
import Tasks from './Tasks';
interface DetailsProps {
    detail: Project;
    updateTask: (projectId: string, taskId: string, name: string, status: string, des: string) => Promise<void>;
    updateName: (id: string, projectName: string, projectDescription: string) => Promise<void>;
    deleteProject: (projectId: string) => Promise<void>;
  }

const Details = ({detail ,updateTask, updateName, deleteProject}: DetailsProps) => {

    const [projectDes, setProjectDes] = useState<string>(detail.projectDescription || "");
    const [inputName, setInputName] = useState<string>(detail.projectName || "");
console.log(projectDes)
useEffect(() => {
    setInputName(detail.projectName || "")
    setProjectDes(detail.projectDescription || "")

},[detail.projectId, detail])
  return (
    <div className='flex flex-col w-[100%] p-4 '>
      <div className='flex justify-between '>

      
      <input onChange={(e) => setInputName(e.target.value)} className='font-bold text-lg' value={inputName}/>
     <div className='flex gap-2'>
        <button className='p-2 text-white rounded-md bg-black' onClick={() => updateName(detail.projectId!,inputName ,projectDes)}>Save Changes</button>
      <button onClick={() => deleteProject(detail.projectId!)} className='p-2 text-white bg-red-600 rounded-md bg-red'>Delete Project</button>
     </div>
      
      </div>
      <textarea onChange={(e) => setProjectDes(e.target.value)} value={projectDes} className='w-full mt-[3vh] h-[20vh] border border-1 border-gray-400 p-2 rounded-md' placeholder='Project Description' />
     
      <p className='font-bold text-lg mt-[3vh]'>Tasks</p>
    
        { detail.tasks &&
            detail.tasks.map((task) => (
                <Tasks task={task} projectId={detail.projectId!} updateTask={updateTask}/>

            ))
        }
      
      <button className='p-2 w-[10vw] mt-[3vh] text-white rounded-md bg-black' >Add Task</button>
    </div>
  )
}

export default Details