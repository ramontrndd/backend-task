import {Task} from './../models/TaskModel';
import connection from '../config/connection';
import { Tasks } from '../controllers/taskController';


export class TaskService {

    static async getAllTasks(): Promise<Task[]> {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tasks';
            connection.query(query, (err, rows) => {
                if(err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }

    static async createNewTask(task: Task): Promise<Task[]> {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO tasks (name,cost,endDate) values(?,?,?)';
            connection.query(query,[task.name, task.cost, task.endDate], (err, results) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    }
}