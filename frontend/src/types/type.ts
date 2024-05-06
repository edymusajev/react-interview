// Task interface
export interface Task {
    taskId: string;
    title: string;
    description: string;
    status: string;
    assignees?: string[];
    dueDate?: string;
    comments?: Comment[];
    subTasks?: SubTask[];
  }
  
  // Comment and SubTask interfaces remain the same
  export interface Comment {
    commentId: string;
    author: string;
    message: string;
    timestamp: string;
  }
  
  export interface SubTask {
    subTaskId: string;
    title: string;
    status: string;
  }
  
  // Project interface remains the same
  export interface Project {
    projectId?: string;
    projectName?: string;
    tasks?: Task[];
    projectDescription?: string;
  }