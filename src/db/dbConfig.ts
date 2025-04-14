import mongoose from 'mongoose';

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
        const Connection = mongoose.connection;

        Connection.on('Connected', () => {
            console.log('MongoDB connected successfully');
        })

        Connection.on('Error', (error) => {
            console.log('MongoDB connection error:', error);
            process.exit(1);
        })


    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        console.log(error);
    }
}

