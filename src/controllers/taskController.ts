import { Request, Response } from 'express'
import { TaskService } from '../services/taskService'

export class Tasks {
  // Obtém todas as tarefas
  static async getTasks(req: Request, res: Response) {
    try {
      const tasks = await TaskService.getAllTasks()
      res.status(200).json(tasks)
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  }

  // Cria uma nova tarefa
  static async createTask(req: Request, res: Response) {
    try {
      const task = req.body
      await TaskService.verifyNameTask(task)
      const newTask = await TaskService.createNewTask(task)
      res.status(201).json({ message: 'A Tarefa foi criada com sucesso!' })
    } catch (err: any) {
      if (err.message === 'Task already exists') {
        res.status(400).json({ message: 'O nome da tarefa já existe' })
      } else {
        res.status(500).json({ message: err.message })
      }
    }
  }

  // Atualiza uma tarefa existente
  static async updateTask(req: Request, res: Response) {
    try {
      const task = req.body
      const id = req.params.id
      task.id = id

      // Verifica se o nome da tarefa já existe
      const existingTask = await TaskService.findTaskByName(task.name)
      if (existingTask && existingTask.id !== id) {
        return res.status(400).json({ message: 'O nome da tarefa já existe' })
      }

      const updatedTask = await TaskService.updateTask(task)
      res.status(200).json({ message: 'A tarefa foi atualizada com sucesso!' })
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  }

  // Deleta uma tarefa
  static async deleteTask(req: Request, res: Response) {
    try {
      const id = req.params.id
      await TaskService.deleteTask(id)
      res.status(200).json({ message: 'A tarefa foi deletada com sucesso!' })
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  }

  // Reordena as tarefas
  static async reorderTasks(req: Request, res: Response) {
    try {
      const { taskIds } = req.body
      if (!Array.isArray(taskIds)) {
        return res.status(400).json({ message: 'Lista de IDs inválida.' })
      }

      await TaskService.reorderTasks(taskIds)
      res
        .status(200)
        .json({ message: 'Ordem das tarefas atualizada com sucesso!' })
    } catch (err: any) {
      res.status(500).json({ message: err.message })
    }
  }

  // Move uma tarefa para cima ou para baixo
  static async moveTask(req: Request, res: Response) {
    try {
      const { taskId, direction } = req.body
      if (!taskId || !['up', 'down'].includes(direction)) {
        return res.status(400).json({ message: 'Parâmetros inválidos.' })
      }

      await TaskService.moveTask(taskId, direction)
      res.status(200).json({
        message: `Tarefa movida para ${direction === 'up' ? 'cima' : 'baixo'} com sucesso!`
      })
    } catch (err: any) {
      if (
        err.message === 'A tarefa já está na primeira posição.' ||
        err.message === 'A tarefa já está na última posição.'
      ) {
        res.status(400).json({ message: err.message })
      } else {
        res.status(500).json({ message: err.message })
      }
    }
  }
}
