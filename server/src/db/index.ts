import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { dbName } from '../utils/constants'

const connectDb = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${dbName}`)
        console.log(`\n MONGODB CONNECTED!! DB HOST: ${connectionInstance.connection.host}` );
    } catch (error) {
        console.error("MONGODB CONNECTION ERROR: ", error);
        process.exit(1);
    }
}

export { connectDb }