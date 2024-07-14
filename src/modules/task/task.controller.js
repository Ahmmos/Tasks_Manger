import { Category } from "../../../database/models/category.model.js"
import { Task } from "../../../database/models/task.model.js"
import { errorCatch } from "../../middleWare/errorCatch.js"
import { AppError } from "../../utilts/appError.js"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'


dotenv.config();
const {TOKEN_SECRET}=process.env




// create new task
const addTask = errorCatch(async (req, res, next) => {
    let task = await Task.create(req.body)
    task.user = req.user.userId
    await task.save();
    res.status(201).json({ Message: "task added succesfully", task })
})

// get all tasks
const getAllTasks = errorCatch(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const startIndex = (page - 1) * limit;
    const totalTasks = await Task.countDocuments();
    const totalPublicTasks = await Task.countDocuments({ "status": "public" })

    if (req.headers.hasOwnProperty("token")) {
        jwt.verify(req.headers.token,TOKEN_SECRET, async (err, decoded) => {
            if (err) return next(new AppError("invalid token", 401))

            // filtering By task shared option (Public/Private)
            
            if (Object.keys(req.query).length > 0) {

                let filter = req.query.status
                let filterdtasks = await Task.find({ 'status': filter }).skip(startIndex).limit(limit)

                let total = await Task.countDocuments({ "status": filter });

                return res.status(200).send({
                    Message: "success", total: total,
                    metadata: {
                        currentPage: page,
                        numberOfPages: Math.ceil(total / limit),
                        limit: limit,
                        nextPage: page + 1
                    }, filterdtasks
                })
            }

            let tasks = await Task.find({ user: decoded.userId })
            return res.status(200).json({
                message: "success", total: totalTasks,
                metadata: {
                    currentPage: page,
                    numberOfPages: Math.ceil(totalTasks / limit),
                    limit: limit,
                    nextPage: page + 1
                }, tasks
            })
        })
    }else {
        let tasks = await Task.find({ status: "public" }).skip(startIndex).limit(limit)
        res.status(200).json({
            message: "success", total: totalPublicTasks,
            metadata: {
                currentPage: page,
                numberOfPages: Math.ceil(totalTasks / limit),
                limit: limit,
                nextPage: page + 1
            }, tasks
        })    
    }
})


// update task which will update only the user that has its data on token
const updateTask = errorCatch(async (req, res, next) => {
    let task = await Task.findOne({ _id: req.params.id })
    if (!task) next(new AppError(" task not found", 404))
    let category = await Category.findOne({ _id: task.category })
    if (!(req.user.userId == category.user)) return next(new AppError("you are not autharized", 401))

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    task || next(new AppError(" task not found", 404))
    !task || res.status(200).send({ message: "updated successfully", task })

})



// delete task which will delete only the user that has its data on token

const deleteTask = errorCatch(async (req, res, next) => {
    let task = await Task.findOne({ _id: req.params.id })
    if (!task) next(new AppError(" task not found or maybe delted", 404))
    let category = await Category.findOne({ _id: task.category })
    if (!(req.user.userId == category.user)) return next(new AppError("you are not autharized", 401))

    task = await Task.findByIdAndDelete(req.params.id)
    task || next(new AppError(" task not found", 404))
    !task || res.status(200).send({ message: "deleted successfully", task })
})


// get another Tasks data (only public categories)
const getTask = errorCatch(async (req, res, next) => {
    let task = await Task.findOne({ $and: [{ _id: req.params.id }, { status: "public" }] })
    task || next(new AppError(" task not found or private", 404))
    !task || res.status(200).send({ message: "Success", task })
})








export {
    addTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTask
}