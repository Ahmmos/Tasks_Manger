import { Router } from "express";
import { verifyToken } from "../../middleWare/verifyToken.js";
import { validate } from "../../middleWare/validate.js";
import { addCategoryVal, updateCategoryVal } from "./category.validation.js";
import { addCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "./category.controller.js";



const categoryRoute = Router()


categoryRoute
    .route('/')
    .post(verifyToken, validate(addCategoryVal), addCategory)
    .get(getAllCategories)
categoryRoute
    .route('/:id')
    .put(verifyToken, validate(updateCategoryVal), updateCategory)
    .delete(verifyToken, deleteCategory)
    .get(getCategory)



export default categoryRoute


