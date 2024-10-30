
import {Request, Response} from 'express'
import {TaskService} from '../services/taskService'


export class Tasks { 

    static async getTasks(req: Request, res: Response) {
        try{
            const tasks = await TaskService.getAllTasks();
            res.status(200).json(tasks);
        }
        catch(err: any){
            res.status(500).json({message: err.message});
        }
    }

    static async createTask(req: Request, res: Response) {
        try{
            const task = req.body;
            const newTask = await TaskService.createNewTask(task);
            res.status(201).json({ message: 'A Tarefa vou criada com sucesso!' });
        }
        catch(err: any){
            res.status(500).json({message: err.message});
        }
    }
}
