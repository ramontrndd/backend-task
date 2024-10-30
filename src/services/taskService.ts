import {Task} from './../models/TaskModel';
import connection from '../config/connection';



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
    static async verifyNameTask(name: Task): Promise <Task[]>{
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tasks WHERE name = ?';
            connection.query(query, [name.name], (err, results) => {
                if(err) {
                    reject(err);
                }
                if(results.length > 0){
                    reject(new Error ('Task already exists'));
                }
                resolve(results);
            });
        });
    }

    static async updateTask(task: Task): Promise<Task[]> {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE tasks SET name = ?, cost = ?, endDate = ? WHERE id = ?';
            connection.query(query, [task.name, task.cost, task.endDate, task.id], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });

    }

    static async deleteTask(id: string): Promise<Task[]> {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM tasks WHERE id = ?';
            connection.query(query, [id], (err, results) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    }
}