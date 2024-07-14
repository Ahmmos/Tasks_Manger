import { Category } from "../../../database/models/category.model.js"
import { errorCatch } from "../../middleWare/errorCatch.js"
import { AppError } from "../../utilts/appError.js"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config();

const {TOKEN_SECRET}=process.env

// create new category

const addCategory = errorCatch(async (req, res, next) => {
    let category = await Category.insertMany(req.body)
    res.status(201).json({ Message: "category added succesfully", category })
})

// get all categories
const getAllCategories = errorCatch(async (req, res, next) => {
    
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const startIndex = (page - 1) * limit;
    const totalCategories = await Category.countDocuments();

    // Filtering By Category Name
    if (req.query.categoryName) {
        const categories = await Category.find({ name: req.query.categoryName })
        let total = await Category.countDocuments({ name: req.query.categoryName })
        res.status(200).json({
            Message: "success", total: total,
            metadata: {
                currentPage: page,
                numberOfPages: Math.ceil(total / limit),
                limit: limit,
                nextPage: page + 1
            }, categories
        })
    } else {

        if (req.headers.hasOwnProperty("token")) {
            jwt.verify(req.headers.token, TOKEN_SECRET, async (err, decoded) => {
                if (err) return next(new AppError("invalid token", 401))
                req.user = decoded
            })
            let categories = await Category.find({ user: req.user.userId }).skip(startIndex).limit(limit)
            res.status(200).json({
                Message: "success", total: totalCategories,
                metadata: {
                    currentPage: page,
                    numberOfPages: Math.ceil(totalCategories / limit),
                    limit: limit,
                    nextPage: page + 1
                }, categories
            })
        }
        let categories = await Category.find({ status: "public" }).skip(startIndex).limit(limit)
        let total = await Category.countDocuments({ status: "public" })
        res.status(200).json({
            Message: "success",
            total: total,
            metadata: {
                currentPage: page,
                numberOfPages: Math.ceil(total / limit),
                limit: limit,
                nextPage: page + 1
            }, categories
        })
    }


})


// update category which will update only the user that has its data on token
const updateCategory = errorCatch(async (req, res, next) => {

    let category = await Category.findOne({ $and: [{ user: req.user.userId }, { _id: req.params.id }] })
    if (!category) return next(new AppError("you are not autharized", 401))
    category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    category || next(new AppError(" category not found", 404))
    !category || res.status(200).send({ message: "updated successfully", category })

})



// delete category which will delete only the user that has its data on token

const deleteCategory = errorCatch(async (req, res, next) => {
    let category = await Category.findOne({ $and: [{ user: req.user.userId }, { _id: req.params.id }] })
    if (!category) return next(new AppError("you are not autharized", 401))
    category = await Category.findByIdAndDelete(req.params.id)
    category || next(new AppError(" category not found", 404))
    !category || res.status(200).send({ message: "deleted successfully", category })
})


// get another user profile data (only public categories)

const getCategory = errorCatch(async (req, res, next) => {

    let category = await Category.findOne({ $and: [{ _id: req.params.id }, { status: "public" }] })
    category || next(new AppError(" category not found or private", 404))
    !category || res.status(200).send({ message: "success", category })
})








export {
    addCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategory
}