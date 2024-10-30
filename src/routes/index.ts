import express from 'express';
import {Tasks} from '../controllers/taskController';

const router = express.Router(); 


router.get('/getTasks', Tasks.getTasks); 
router.post('/createTask', Tasks.createTask);
router.patch('/updateTask/:id', Tasks.updateTask);
router.delete('/deleteTask/:id', Tasks.deleteTask);

export default router;