import { User } from "../../../database/models/user.model.js"
import { errorCatch } from "../../middleWare/errorCatch.js"
import { AppError } from "../../utilts/appError.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"




// create new user 
const signUp = errorCatch(async (req, res, next) => {
    let user = await User.insertMany(req.body)
    // to hide password from returned data 
    user[0].password = undefined
    res.status(201).json({ Message: "user added succesfully", user })

})


// login to app and create token for authorization
const signIn = errorCatch(async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ "email": email })

    if (!user || !bcrypt.compareSync(password, user.password)) return next(new AppError("user not found", 404))
    jwt.sign({ userId: user._id, name: user.name }, "mySigntureIsAhmedMostafa",
        (err, token) => {
            res.status(200).json({ Message: "login successfully", token })
        })
})

// update user which will update only the user that has its data on token
const updateUser = errorCatch(async (req, res, next) => {

    let user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true })
    if (!user) return next(new AppError(" User not found", 404))
    res.status(200).send({ message: " user updated successfully" })
})



// delete user which will delete only the user that has its data on token

const deleteUser = errorCatch(async (req, res, next) => {
    let user = await User.findByIdAndDelete(req.user.userId)
    if (!user) return next(new AppError(" User not found", 404))
    res.status(200).send({ message: "user deleted successfully", user })
})


// get another user profile data 
const getUser = errorCatch(async (req, res, next) => {

    let user = await User.findById(req.params.id, "-password")
    if (!user) return next(new AppError("user not found", 404))
    res.status(200).send({ message: "success", user })
})








export {
    signUp,
    signIn,
    updateUser,
    deleteUser,
    getUser
}