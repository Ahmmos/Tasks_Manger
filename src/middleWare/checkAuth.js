import { Category } from "../../database/models/category.model.js"
import { User } from "../../database/models/user.model.js"
import { AppError } from "../utilts/appError.js"
import { errorCatch } from "./errorCatch.js"


const checkAuthRole = errorCatch(async (req, res, next) => {
    let user = await User.findById(req.user.userId)
    if (!user) return next(new AppError("you are not authorized", 401))
    next()
})



export {
    checkAuthRole,
    isAuth
}
