import express, { Request, Response, NextFunction } from 'express'
import { Tasks } from '../controllers/taskController'

const router = express.Router()

// Helper para encapsular funções assíncronas e lidar com erros automaticamente
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

// Rota para obter todas as tarefas
router.get('/getTasks', asyncHandler(Tasks.getTasks))

// Rota para criar uma nova tarefa
router.post('/createTask', asyncHandler(Tasks.createTask))

// Rota para atualizar uma tarefa existente
router.patch('/updateTask/:id', asyncHandler(Tasks.updateTask))

// Rota para deletar uma tarefa
router.delete('/deleteTask/:id', asyncHandler(Tasks.deleteTask))

// Rota para reordenar as tarefas
router.put('/reorderTasks', asyncHandler(Tasks.reorderTasks))

// Rota para mover uma tarefa para cima ou para baixo
router.put('/moveTask', asyncHandler(Tasks.moveTask))

export default router
