import { Router } from "express";
import { deleteUser, getUser, signIn, signUp, updateUser } from "./user.controller.js";
import { checkEmail } from "../../middleWare/checkEmail.js";
import { verifyToken } from "../../middleWare/verifyToken.js";
import { validate } from "../../middleWare/validate.js";
import { singInVal, singUpVal, updateVal } from "./user.validation.js";



const userRoute = Router()


userRoute.post('/signup', validate(singUpVal), checkEmail, signUp)
userRoute.post('/signin', validate(singInVal), signIn)
userRoute
.route("/:id")
.put(verifyToken, validate(updateVal), updateUser)
.delete( verifyToken, deleteUser)
.get( getUser)


export default userRoute


