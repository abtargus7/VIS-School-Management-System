import express, {Express, Request, Response} from "express"
import cors from "cors"
import errorHandler from "./middlewares/errorHandler.middleware.ts"

// initialize express app and port
const app: Express = express()

//middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static('public'))



// import routers




app.use(errorHandler)

export {app}

