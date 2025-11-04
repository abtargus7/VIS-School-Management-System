import "dotenv/config"
import { app } from "./app"
import { connectDb } from "./db"

const PORT = process.env.PORT || 5000

connectDb()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
    .catch((error) => {
        console.log(error)
    })

