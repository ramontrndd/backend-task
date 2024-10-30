
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
}
