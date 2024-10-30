
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
        try {
            const task = req.body;
    
            // Verifica se o nome da tarefa já existe
            await TaskService.verifyNameTask(task);
    
            // Se não existir, cria a nova tarefa
            const newTask = await TaskService.createNewTask(task);
            res.status(201).json({ message: 'A Tarefa foi criada com sucesso!'});
        } catch (err: any) {
            if (err.message === 'Task already exists') {
                res.status(400).json({ message: 'O nome da tarefa já existe' });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    }

    static async updateTask(req: Request, res: Response) {
        try {
            const task = req.body;
            const id = req.params.id;
            task.id = id;
            const updatedTask = await TaskService.updateTask(task);
            res.status(200).json({ message: 'A tarefa foi atualizada com sucesso!'});
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    static async deleteTask(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await TaskService.deleteTask(id);
            res.status(200).json({ message: 'A tarefa foi deletada com sucesso!' });
        } catch (err: any) {
                res.status(500).json({ message: err.message });
            }
        }
    }

