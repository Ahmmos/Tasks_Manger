
import bcrypt from 'bcrypt'
import { User } from '../../database/models/user.model.js'
import { AppError } from '../utilts/appError.js'

const checkEmail = async (req, res, next) => {

    const isFound = await User.findOne({ email: req.body.email })
    if (isFound) return next(new AppError("email is already exsist", 409))

    req.body.password = bcrypt.hashSync(req.body.password, 8)
    next()
}





export {
    checkEmail
}