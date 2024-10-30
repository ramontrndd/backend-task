import {Task} from './../models/TaskModel';
import connection from '../config/connection';


export class TaskService {

    static async getAllTasks(): Promise<Task[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tasks', (err, rows) => {
                if(err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
}