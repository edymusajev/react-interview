import React, { useEffect, useState } from 'react'
import { Task } from '../types/type';

interface TasksProps {
    projectId: string;
    task: Task;
    updateTask: (projectId: string, taskId: string, name: string, status: string, des: string) => Promise<void>;
  }

const Tasks = ({projectId,task, updateTask}: TasksProps) => {
    const [taskName, setTaskName] = useState<string>(task.title || "")
    const [status, setStatus] = useState<string>(task.status || "IN PROGRESS")
    const [description , setDescription] = useState<string>(task.description || "")

    useEffect(() => {
        setTaskName(task.title || "")
        setDescription(task.description || "")
        setStatus(task.status || "IN PROGRESS")

    },[projectId])
  return (
    <div className='flex flex-col w-[100%] p-2 h-[20vh] border border-1 border-gray-400 rounded-md'> 
    <div className='flex justify-between' >
    <input onChange={(e) => setTaskName(e.target.value)} className='' value={taskName}/>
    {/* <p>{task.title}</p> */}
    <div className='flex gap-2'>
    <button className='p-2 text-white rounded-md bg-black' onClick={() => updateTask(projectId, task.taskId, taskName, status, description)}>Save Changes</button>
    <button className='p-2  rounded-md bg-white text-red-600' >Delete Task</button>

    </div>
   
  </div>
  <select value={status} className='outline-none w-[10vw]' onChange={(e) => setStatus(e.target.value) }>
      <option>IN PROGRESS</option>
      <option>DONE</option>
      <option>TO DO</option>
    </select>

    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full mt-[1vh] h-[20vh] border border-1 border-gray-400 p-2 rounded-md' placeholder='Description'/>

</div>
  )
}

export default Tasks