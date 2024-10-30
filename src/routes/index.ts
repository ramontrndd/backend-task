import express from 'express';
import {Tasks} from '../controllers/taskController';

const router = express.Router(); 


router.get('/getTasks', Tasks.getTasks); 
router.post('/createTask', Tasks.createTask);

export default router;