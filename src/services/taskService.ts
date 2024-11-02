import { Task } from './../models/TaskModel'
import connection from '../config/connection'

export class TaskService {
  static async getAllTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks ORDER BY orderTask'
      connection.query(query, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })
  }

  static async createNewTask(task: Task): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO tasks (name, cost, endDate, orderTask) 
        VALUES (?, ?, ?, (SELECT COALESCE(MAX(orderTask), 0) + 1 FROM (SELECT orderTask FROM tasks) AS subquery))
      `
      connection.query(
        insertQuery,
        [task.name, task.cost, task.endDate],
        (err, result) => {
          if (err) {
            return reject(err)
          }

          const newTaskId = result.insertId

          // Recupera a nova tarefa inserida pelo `id`
          connection.query(
            'SELECT * FROM tasks WHERE id = ?',
            [newTaskId],
            (err, rows) => {
              if (err) {
                return reject(err)
              }

              resolve(rows)
            }
          )
        }
      )
    })
  }

  static async verifyNameTask(name: Task): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks WHERE name = ?'
      connection.query(query, [name.name], (err, results) => {
        if (err) {
          reject(err)
        }
        if (results.length > 0) {
          reject(new Error('Task already exists'))
        }
        resolve(results)
      })
    })
  }

  static async updateTask(task: Task): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const query =
        'UPDATE tasks SET name = ?, cost = ?, endDate = ? WHERE id = ?'
      connection.query(
        query,
        [task.name, task.cost, task.endDate, task.id],
        (err, results) => {
          if (err) {
            reject(err)
          }
          resolve(results)
        }
      )
    })
  }

  static async deleteTask(id: string): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tasks WHERE id = ?'
      connection.query(query, [id], (err, results) => {
        if (err) {
          reject(err)
        }
        resolve(results)
      })
    })
  }

  static async findTaskByName(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM tasks WHERE name = ?',
        [name],
        (err, results) => {
          if (err) {
            return reject(err)
          }
          resolve(results[0])
        }
      )
    })
  }

  static async reorderTasks(taskIds: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.beginTransaction(async (err) => {
        if (err) reject(err)

        try {
          for (let i = 0; i < taskIds.length; i++) {
            const query = 'UPDATE tasks SET orderTask = ? WHERE id = ?'
            await connection.query(query, [i, taskIds[i]])
          }
          connection.commit((err) => {
            if (err) {
              connection.rollback()
              reject(err)
            }
            resolve()
          })
        } catch (err) {
          connection.rollback()
          reject(err)
        }
      })
    })
  }

  static async moveTask(
    taskId: string,
    direction: 'up' | 'down'
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.beginTransaction(async (err) => {
        if (err) return reject(err)

        try {
          // Obtém a posição atual da tarefa
          const taskResult: any = await new Promise((resolve, reject) => {
            connection.query(
              'SELECT `orderTask` FROM tasks WHERE id = ?',
              [taskId],
              (err, rows) => (err ? reject(err) : resolve(rows))
            )
          })

          const task = taskResult[0]
          if (!task) throw new Error('Tarefa não encontrada.')

          const currentOrder = task.orderTask
          const newOrder =
            direction === 'up' ? currentOrder - 1 : currentOrder + 1

          // Busca a tarefa adjacente na nova posição
          const adjacentTaskResult: any = await new Promise(
            (resolve, reject) => {
              connection.query(
                'SELECT id FROM tasks WHERE `orderTask` = ?',
                [newOrder],
                (err, rows) => (err ? reject(err) : resolve(rows))
              )
            }
          )

          const adjacentTask = adjacentTaskResult[0]
          if (!adjacentTask) {
            throw new Error(
              direction === 'up'
                ? 'A tarefa já está na primeira posição.'
                : 'A tarefa já está na última posição.'
            )
          }

          // Realiza a troca das posições
          await new Promise((resolve, reject) => {
            connection.query(
              'UPDATE tasks SET `orderTask` = ? WHERE id = ?',
              [newOrder, taskId],
              (err) => (err ? reject(err) : resolve(null))
            )
          })
          await new Promise((resolve, reject) => {
            connection.query(
              'UPDATE tasks SET `orderTask` = ? WHERE id = ?',
              [currentOrder, adjacentTask.id],
              (err) => (err ? reject(err) : resolve(null))
            )
          })

          // Confirma a transação
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => reject(err))
            }
            resolve()
          })
        } catch (error) {
          connection.rollback(() => reject(error))
        }
      })
    })
  }
}
