import express, { Request, Response, NextFunction } from 'express'
import { Tasks } from '../controllers/taskController'

const router = express.Router()

// Helper para encapsular funções assíncronas e lidar com erros automaticamente
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

router.get('/getTasks', asyncHandler(Tasks.getTasks))
router.post('/createTask', asyncHandler(Tasks.createTask))
router.patch('/updateTask/:id', asyncHandler(Tasks.updateTask))
router.delete('/deleteTask/:id', asyncHandler(Tasks.deleteTask))
router.put('/reorderTasks', asyncHandler(Tasks.reorderTasks))
router.put('/moveTask', asyncHandler(Tasks.moveTask))

export default router
