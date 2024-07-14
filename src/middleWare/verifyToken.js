import jwt from "jsonwebtoken"
import { AppError } from "../utilts/appError.js"
import dotenv from 'dotenv'

dotenv.config(); // Load the .env file's content into the process.env object

const { TOKEN_SECRET } = process.env // Destructuring the process.env object and .env data

export const verifyToken = async (req, res, next) => {
    let { token } = req.headers

    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
        if (err) return next(new AppError("invalid token", 401))

        // add field called user to the request and next will go with that data
        req.user = decoded
        next()
    })
}
