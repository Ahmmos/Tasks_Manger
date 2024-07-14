// use dto handel in error in the code 
process.on("uncaughtException", (err) => {
    console.log("error in code", err)
})

import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import userRoute from './src/modules/user/user.Route.js'
import { globalError } from './src/middleWare/globalErrorHandling.js'
import categoryRoute from './src/modules/category/category.Route.js'
import taskRoute from './src/modules/task/task.Route.js'

const app = express()
const port = 3000
app.use(express.json())



app.use("/users", userRoute)
app.use("/categories", categoryRoute)
app.use("/tasks", taskRoute)

app.use(globalError)

// used to handel errors outside the express app like (db Connection)
process.on("unhandeledRejection", (err) => {
    console.log("internal error", err)
})
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



