import mongoose from 'mongoose';
import { DB_URI, NODE_ENV} from "../env.js";

if(!DB_URI) {
    throw new Error('Please define the MONGODB_URI env variable inside .env.<development/production>.local');
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Database connected in ${NODE_ENV} mode`)
    } catch(error) {
        console.error('Error connecting to the database: ', error.message);

        process.exit(1)
    }
}

export default connectToDatabase;