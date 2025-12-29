import express, {Express, Request, Response} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/errorHandler.middleware"

// initialize express app and port
const app: Express = express()

//middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())
app.use(express.static('public'))



// import routers
import userRouter from "./routes/user.routes"
import subjectRouter from "./routes/subject.routes"
import gradeRouter from "./routes/grade.routes"
import questionTypeRouter from "./routes/questionType.routes"

// routes
app.use("/api/v1/users", userRouter)
app.use("/api/v1/subjects", subjectRouter)
app.use("/api/v1/grades", gradeRouter)
app.use("/api/v1/question-types", questionTypeRouter)



app.use(errorHandler)

export {app}

