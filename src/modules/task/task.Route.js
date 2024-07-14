import { Router } from "express";
import { verifyToken } from "../../middleWare/verifyToken.js";
import { validate } from "../../middleWare/validate.js";
import { addTaskVal, updateTaskVal } from "./task.validation.js";
import { addTask, deleteTask, getAllTasks, getTask, updateTask } from "./task.controller.js";



const taskRoute = Router()


taskRoute
    .route('/')
    .post(verifyToken, validate(addTaskVal), addTask)
    .get(getAllTasks)
taskRoute
    .route('/:id')
    .put(verifyToken, validate(updateTaskVal), updateTask)
    .delete(verifyToken, deleteTask)
    .get(getTask)



export default taskRoute


